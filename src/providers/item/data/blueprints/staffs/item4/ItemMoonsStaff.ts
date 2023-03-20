import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { IEquippableTwoHandedStaffTier4WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemMoonsStaff: IEquippableTwoHandedStaffTier4WeaponBlueprint = {
  key: StaffsBlueprint.MoonsStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Blue,
  textureAtlas: "items",
  texturePath: "staffs/moon's-staff.png",
  name: "Moons Staff",
  description:
    "A staff or rod imbued with the power of the moon and its lunar forces, often used in rituals or spells.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 34,
  defense: 32,
  tier: 4,
  basePrice: 80,
  maxRange: RangeTypes.Medium,
  isTwoHanded: true,
};
