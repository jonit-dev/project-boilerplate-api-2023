import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";

import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(CharacterWeight)
export class CharacterWeight {
  public async getMaxWeight(character: ICharacter): Promise<number> {
    const skill = await Skill.findById(character.skills).lean();
    const maxWeight = skill?.strength.level * 15;

    return maxWeight;
  }

  public async getWeight(character: ICharacter): Promise<number> {
    const equipment = await Equipment.findById(character.equipment).lean();
    const inventory = await character.inventory;
    const itemContainer = await ItemContainer.findById(inventory?.itemContainer).lean();

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
          totalWeight += item.weight;
        }
      }
    }

    if (itemContainer) {
      for (const bagItem of itemContainer.itemIds) {
        const item = await Item.findById(bagItem).lean();
        if (item) {
          totalWeight = totalWeight + item.weight;
        }
      }
    }

    return totalWeight;
  }
}
