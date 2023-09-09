import { IEquippableTwoHandedStaffTier14WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemElementalStaff: IEquippableTwoHandedStaffTier14WeaponBlueprint = {
  key: StaffsBlueprint.ElementalStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  textureAtlas: "items",
  texturePath: "staffs/elemental-staff.png",
  name: "Elemental Staff",
  description:
    "Topped with a rotating crystal that changes color, this staff can control various elements. Versatile but requires skilled handling.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 105,
  defense: 70,
  tier: 14,
  maxRange: RangeTypes.High,
  basePrice: 190,
  isTwoHanded: true,
};
