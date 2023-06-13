import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";

interface ICharacterWeaponResult {
  item: IItem;
  location: ItemSlotType;
}

@provide(CharacterWeapon)
export class CharacterWeapon {
  constructor(private newRelic: NewRelic) {}

  public async getWeapon(character: ICharacter): Promise<ICharacterWeaponResult | undefined> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "CharacterWeapon.getWeapon",
      async () => {
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
          return { item: rightHandItem, location: ItemSlotType.RightHand };
        }

        if (leftHandItem?.type === ItemType.Weapon && leftHandItem?.subType !== ItemSubType.Shield) {
          return { item: leftHandItem, location: ItemSlotType.LeftHand };
        }
      }
    );
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

    if (!weapon || !weapon.item) {
      return EntityAttackType.Melee;
    }

    const rangeType = weapon?.item.rangeType as unknown as EntityAttackType;

    return rangeType;
  }
}
