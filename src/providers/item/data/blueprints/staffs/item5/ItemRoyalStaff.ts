import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { IEquippableTwoHandedStaffTier5WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRoyalStaff: IEquippableTwoHandedStaffTier5WeaponBlueprint = {
  key: StaffsBlueprint.RoyalStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Blue,
  textureAtlas: "items",
  texturePath: "staffs/royal-staff.png",
  name: "Royal Staff",
  description: "A regal staff befitting of royalty or nobility, often used as a symbol of power and prestige.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 40,
  defense: 10,
  tier: 5,
  maxRange: RangeTypes.High,
  basePrice: 90,
  isTwoHanded: true,
};
