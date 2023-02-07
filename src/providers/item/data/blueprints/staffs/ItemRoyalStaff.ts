import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.RoyalStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Blue,
  textureAtlas: "items",
  texturePath: "staffs/royal-staff.png",
  name: "Royal Staff",
  description: "A regal staff befitting of royalty or nobility, often used as a symbol of power and prestige.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 17,
  defense: 10,
  maxRange: 7,
  basePrice: 90,
};
