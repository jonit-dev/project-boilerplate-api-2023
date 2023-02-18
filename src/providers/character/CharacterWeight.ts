import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents } from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { CharacterInventory } from "./CharacterInventory";
import { CharacterItemInventory } from "./characterItems/CharacterItemInventory";

@provide(CharacterWeight)
export class CharacterWeight {
  constructor(
    private characterInventory: CharacterInventory,
    private socketMessaging: SocketMessaging,
    private characterItemInventory: CharacterItemInventory
  ) {}

  public async updateCharacterWeight(character: ICharacter): Promise<void> {
    const weight = await this.getWeight(character);
    const maxWeight = await this.getMaxWeight(character);

    await Character.updateOne(
      {
        _id: character._id,
      },
      {
        $set: {
          weight,
          maxWeight,
        },
      }
    );

    //! Requires virtuals
    character = (await Character.findById(character._id).lean({ virtuals: true, defaults: true })) || character;

    this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, {
      speed: character.speed,
      targetId: character._id,
    });
  }

  public async getMaxWeight(character: ICharacter): Promise<number> {
    const skill = await Skill.findById(character.skills).lean();
    if (skill) {
      return skill.strength.level * 15;
    } else {
      return 15;
    }
  }

  public async getWeight(character: ICharacter): Promise<number> {
    const equipment = await Equipment.findById(character.equipment).lean();
    const inventory = await this.characterInventory.getInventory(character);
    const inventoryContainer = await ItemContainer.findById(inventory?.itemContainer);

    let totalWeight = 0;
    if (equipment) {
      const { head, neck, leftHand, rightHand, ring, legs, boot, accessory, armor, inventory } = equipment;
      const slots: Types.ObjectId[] = [
        head!,
        neck!,
        leftHand!,
        rightHand!,
        ring!,
        legs!,
        boot!,
        accessory!,
        armor!,
        inventory!,
      ];
      const nestedBags = await this.characterItemInventory.getAllItemsFromInventoryNested(character);

      if (nestedBags.length > 0) {
        for (const item of nestedBags) {
          if (item.name === "Bag" || item.name === "Backpack") {
            const inventoryContainer = await ItemContainer.findById(item?.itemContainer);
            for (const bagItem of inventoryContainer!.itemIds) {
              totalWeight += await this.getWeithFromItemContainer(bagItem);
            }
          }
        }
      }

      for (const slot of slots) {
        const item = await Item.findById(slot).lean();
        if (item) {
          if (item.stackQty && item.stackQty > 1) {
            // -1 because the count is include the weight of the container item.
            // 100 arrows x 0.1 = 10 weight, but the result will be 10.1 without the -1.
            totalWeight += item.weight * (item.stackQty - 1);
          }
          totalWeight += item.weight;
        }
      }
    }

    if (inventoryContainer) {
      for (const bagItem of inventoryContainer!.itemIds) {
        totalWeight += await this.getWeithFromItemContainer(bagItem);
      }
    }
    return totalWeight;
  }

  public async getWeightRatio(character: ICharacter, item: IItem): Promise<number> {
    const weight = await this.getWeight(character);
    const maxWeight = await this.getMaxWeight(character);

    return (weight + item.weight) / maxWeight;
  }

  private async getWeithFromItemContainer(bagItem: string): Promise<number> {
    let totalWeight = 0;
    try {
      // @ts-ignore
      const item = await Item.findById(bagItem.toString("hex"));
      if (item) {
        if (item.stackQty && item.stackQty > 1) {
          totalWeight += item.weight * (item.stackQty - 1);
        }
        totalWeight += item.weight;
      }
    } catch (error) {
      console.error(error);
    }

    return totalWeight;
  }
}
