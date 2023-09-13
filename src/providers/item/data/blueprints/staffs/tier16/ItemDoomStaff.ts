import { IEquippableTwoHandedStaffTier16WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDoomStaff: IEquippableTwoHandedStaffTier16WeaponBlueprint = {
  key: StaffsBlueprint.DoomStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.FireBall,
  textureAtlas: "items",
  texturePath: "staffs/doom-staff.png",
  name: "Doom Staff",
  description:
    "Carved from obsidian and crowned with a skull, this staff is a harbinger of doom. Capable of casting curses that weaken enemies over time.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 118,
  defense: 100,
  tier: 16,
  maxRange: RangeTypes.High,
  basePrice: 220,
  isTwoHanded: true,
};
