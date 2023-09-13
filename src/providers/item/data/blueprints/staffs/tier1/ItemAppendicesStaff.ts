import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { IEquippableTwoHandedStaffTier1WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemAppendicesStaff: IEquippableTwoHandedStaffTier1WeaponBlueprint = {
  key: StaffsBlueprint.AppendicesStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  textureAtlas: "items",
  texturePath: "staffs/appendice's-staff.png",
  name: "Appendice's Staff",
  description:
    "A basic wooden staff used by novice mages learning the fundamentals of magic. It is a simple yet reliable tool for channeling magical energy.",
  attack: 10,
  defense: 4,
  tier: 1,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 60,
  maxRange: RangeTypes.Medium,
  isTwoHanded: true,
};
