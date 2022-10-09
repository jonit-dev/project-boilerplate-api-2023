import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType } from "@rpg-engine/shared";

import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(EquipmentRangeUpdate)
export class EquipmentRangeUpdate {
  public async updateCharacterAttackType(character: ICharacter, item: IItem): Promise<void> {
    const isEquippableOnHands =
      item.allowedEquipSlotType?.includes(ItemSlotType.LeftHand) ||
      item.allowedEquipSlotType?.includes(ItemSlotType.RightHand);

    if (isEquippableOnHands) {
      // fetch our equipment left hand and right hand items
      const equipment = await Equipment.findById(character.equipment);

      if (!equipment) {
        throw new Error("Equipment not found");
      }

      const leftHandItem = await Item.findById(equipment.leftHand);

      const rightHandItem = await Item.findById(equipment.rightHand);

      const equipmentRanges = _.compact([leftHandItem?.rangeType, rightHandItem?.rangeType]);

      if (equipmentRanges.length === 0) {
        character.attackType = EntityAttackType.Melee;
        await character.save();
        return;
      }

      const areAllRanged = equipmentRanges.every((range) => range === EntityAttackType.Ranged);
      const areAllMelee = equipmentRanges.every((range) => range === EntityAttackType.Melee);
      const areSomeMelee = equipmentRanges.some((range) => range === EntityAttackType.Melee);

      if (areAllRanged) {
        character.attackType = EntityAttackType.Ranged;
        await character.save();
        return;
      }

      if (areAllMelee) {
        character.attackType = EntityAttackType.Melee;
        await character.save();
        return;
      }

      if (areSomeMelee) {
        character.attackType = EntityAttackType.MeleeRanged;
        await character.save();
        return;
      }

      character.attackType = EntityAttackType.Melee;
      await character.save();
    }
  }
}
