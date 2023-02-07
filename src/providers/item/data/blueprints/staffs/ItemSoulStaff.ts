import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSoulStaff: Partial<IMagicStaff> = {
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
  attack: 12,
  defense: 3,
  maxRange: 6,
  basePrice: 55,
};
