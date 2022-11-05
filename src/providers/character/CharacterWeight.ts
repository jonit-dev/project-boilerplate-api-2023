import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";

import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(CharacterWeight)
export class CharacterWeight {
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
  }

  public async getMaxWeight(character: ICharacter): Promise<number> {
    const skill = await Skill.findById(character.skills).lean();
    const maxWeight = skill?.strength.level * 15;

    return maxWeight;
  }

  public async getWeight(character: ICharacter): Promise<number> {
    const equipment = await Equipment.findById(character.equipment);
    const inventory = await character.inventory;
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
      for (const bagItem of inventoryContainer.itemIds) {
        const item = await Item.findById(bagItem).lean();
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

    return totalWeight;
  }

  public async getWeightRatio(character: ICharacter, item: IItem): Promise<number> {
    const weight = await this.getWeight(character);
    const maxWeight = await this.getMaxWeight(character);

    return (weight + item.weight) / maxWeight;
  }
}
