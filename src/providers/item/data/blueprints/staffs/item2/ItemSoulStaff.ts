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

export const itemSoulStaff: IEquippableTwoHandedStaffTier2WeaponBlueprint = {
  key: StaffsBlueprint.SoulStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Blue,
  textureAtlas: "items",
  texturePath: "staffs/soul-staff.png",
  name: "Soul Staff",
  description:
    "A staff or rod imbued with the essence of the soul, often used in rituals or spells related to the spirit world.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 16,
  defense: 4,
  tier: 2,
  maxRange: RangeTypes.Medium,
  basePrice: 55,
  isTwoHanded: true,
};
