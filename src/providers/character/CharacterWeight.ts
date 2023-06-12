import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BasicAttribute, CharacterSocketEvents, ICharacterAttributeChanged, ItemType } from "@rpg-engine/shared";

import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { CharacterInventory } from "./CharacterInventory";
import { CharacterItemInventory } from "./characterItems/CharacterItemInventory";

@provide(CharacterWeight)
export class CharacterWeight {
  constructor(
    private characterInventory: CharacterInventory,
    private socketMessaging: SocketMessaging,
    private characterItemInventory: CharacterItemInventory,
    private traitGetter: TraitGetter,
    private newRelic: NewRelic
  ) {}

  public async updateCharacterWeight(character: ICharacter): Promise<void> {
    await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "CharacterWeight/updateCharacterWeight",
      async () => {
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

        this.socketMessaging.sendEventToUser<ICharacterAttributeChanged>(
          character.channelId!,
          CharacterSocketEvents.AttributeChanged,
          {
            speed: character.speed,
            weight,
            maxWeight,
            targetId: character._id,
          }
        );
      }
    );
  }

  public async getMaxWeight(character: ICharacter): Promise<number> {
    const skills = await Skill.findById(character.skills).lean();
    if (skills) {
      const strengthLvl = await this.traitGetter.getSkillLevelWithBuffs(skills as ISkill, BasicAttribute.Strength);

      return strengthLvl * 15;
    } else {
      return 15;
    }
  }

  public async getWeight(character: ICharacter): Promise<number> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "CharacterWeight/getWeight",
      async () => {
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
              // check if nestedBag is actually on the inventory top level

              const isInInventory = await this.characterItemInventory.checkItemInInventory(item._id, character);

              if (!isInInventory) continue;

              if (item.type === ItemType.Container) {
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
    );
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
