import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { IEquippableTwoHandedStaffTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFireStaff: IEquippableTwoHandedStaffTier3WeaponBlueprint = {
  key: StaffsBlueprint.FireStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.FireBall,
  textureAtlas: "items",
  texturePath: "staffs/fire-staff.png",
  name: "Fire Staff",
  description:
    "A staff imbued with the power of flames, adorned with a glowing fire ember gem at its peak. It is capable of unleashing fiery attacks and generating intense heat.",
  attack: 24,
  defense: 6,
  tier: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 77,
  maxRange: RangeTypes.Medium,
  isTwoHanded: true,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 80,
};
