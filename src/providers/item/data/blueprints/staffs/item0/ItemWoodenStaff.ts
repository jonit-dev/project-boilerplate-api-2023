import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { IEquippableTwoHandedStaffTier0WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWoodenStaff: IEquippableTwoHandedStaffTier0WeaponBlueprint = {
  key: StaffsBlueprint.WoodenStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Blue,

  textureAtlas: "items",
  texturePath: "staffs/wooden-staff.png",
  name: "Training Staff",
  description: "A long wooden pole used for ranged attacks or as a magical implement.",
  attack: 1,
  defense: 1,
  tier: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 50,
  maxRange: RangeTypes.Short,
  isTwoHanded: true,
  isTraining: true,
};
