import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";

import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";
import { IEquippableTwoHandedStaffTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";

export const itemAquaStaff: IEquippableTwoHandedStaffTier2WeaponBlueprint = {
  key: StaffsBlueprint.AquaStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  projectileAnimationKey: AnimationEffectKeys.Blue,
  rangeType: EntityAttackType.Ranged,
  maxRange: RangeTypes.Medium,
  textureAtlas: "items",
  texturePath: "staffs/aqua-staff.png",
  name: "Aqua Staff",
  description:
    "The Aqua Staff is a powerful magical weapon in the shape of a long staff with a green handle and a large blue gemstone on top that glows with an intense and mesmerizing light. The gemstone is said to be infused with the power of water, granting the staff the ability to control and manipulate water in various ways.",
  weight: 1.3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 18,
  defense: 4,
  tier: 2,
  basePrice: 85,
  isTwoHanded: true,
};
