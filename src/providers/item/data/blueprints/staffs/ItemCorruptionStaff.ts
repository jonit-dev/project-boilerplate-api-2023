import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCorruptionStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.CorruptionStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Blue,
  textureAtlas: "items",
  texturePath: "staffs/corruption-staff.png",
  name: "Corruption Staff",
  description: "A twisted, corrupted staff imbued with dark energy, capable of sapping the life force of its victims.",
  attack: 12,
  defense: 6,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 69,
  maxRange: 6,
};
