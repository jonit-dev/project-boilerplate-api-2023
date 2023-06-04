import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { IEquippableTwoHandedStaffTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCorruptionStaff: IEquippableTwoHandedStaffTier2WeaponBlueprint = {
  key: StaffsBlueprint.CorruptionStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Blue,
  textureAtlas: "items",
  texturePath: "staffs/corruption-staff.png",
  name: "Corruption Staff",
  description: "A twisted, corrupted staff imbued with dark energy, capable of sapping the life force of its victims.",
  attack: 20,
  defense: 4,
  tier: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 69,
  maxRange: RangeTypes.Medium,
  isTwoHanded: true,
};
