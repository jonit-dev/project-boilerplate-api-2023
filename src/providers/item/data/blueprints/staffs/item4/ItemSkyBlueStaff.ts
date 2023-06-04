import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";

import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";
import { IEquippableTwoHandedStaffTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";

export const itemSkyBlueStaff: IEquippableTwoHandedStaffTier4WeaponBlueprint = {
  key: StaffsBlueprint.SkyBlueStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Blue,
  textureAtlas: "items",
  texturePath: "staffs/sky-blue-staff.png",
  name: "Sky Blue Staff",
  description:
    "The Sky Blue Staff is a majestic weapon, towering over its wielder with a long, slender handle. At the top of the staff is a beautiful sky blue gemstone that glows with an ethereal light. The staff possesses the ability to manipulate air currents, allowing the wielder to create powerful gusts of wind and even control the weather.",
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 30,
  defense: 7,
  tier: 4,
  maxRange: RangeTypes.Medium,
  basePrice: 85,
  isTwoHanded: true,
};
