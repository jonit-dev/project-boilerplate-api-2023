import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSubType, ItemType } from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";

@provide(CharacterWeapon)
export class CharacterWeapon {
  public async getWeapon(character: ICharacter): Promise<IItem | undefined> {
    const equipment = (await Equipment.findById(character.equipment).lean()) as IEquipment;

    if (!equipment) {
      return undefined;
    }

    const rightHandItem = equipment.rightHand
      ? ((await Item.findById(equipment.rightHand).lean({ virtuals: true, defaults: true })) as IItem)
      : undefined;
    const leftHandItem = equipment.leftHand
      ? ((await Item.findById(equipment.leftHand).lean({ virtuals: true, defaults: true })) as IItem)
      : undefined;

    // ItemSubType Shield is of type Weapon, so check that the weapon is not subType Shield (because cannot attack with Shield)
    if (rightHandItem?.type === ItemType.Weapon && rightHandItem?.subType !== ItemSubType.Shield) {
      return rightHandItem;
    }

    if (leftHandItem?.type === ItemType.Weapon && leftHandItem?.subType !== ItemSubType.Shield) {
      return leftHandItem;
    }
  }

  public async hasShield(character: ICharacter): Promise<boolean | undefined> {
    const equipment = (await Equipment.findById(character.equipment).lean()) as IEquipment;

    if (!equipment) {
      return;
    }

    const leftHandItem = equipment.leftHand
      ? ((await Item.findById(equipment.leftHand).lean({ virtuals: true, defaults: true })) as IItem)
      : undefined;

    const rightHandItem = equipment.rightHand
      ? ((await Item.findById(equipment.rightHand).lean({ virtuals: true, defaults: true })) as IItem)
      : undefined;

    if (leftHandItem?.subType === ItemSubType.Shield || rightHandItem?.subType === ItemSubType.Shield) {
      return true;
    }

    return false;
  }

  public async getAttackType(character: ICharacter): Promise<EntityAttackType | undefined> {
    const weapon = await this.getWeapon(character);

    if (!weapon) {
      return EntityAttackType.Melee;
    }

    const rangeType = weapon?.rangeType as unknown as EntityAttackType;

    return rangeType;
  }
}
