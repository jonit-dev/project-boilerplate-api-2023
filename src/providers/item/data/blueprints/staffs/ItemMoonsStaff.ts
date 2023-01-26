import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemMoonsStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.MoonsStaff,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Staff,
  textureAtlas: "items",
  texturePath: "staffs/moon's-staff.png",
  name: "Moons Staff",
  description:
    "A staff or rod imbued with the power of the moon and its lunar forces, often used in rituals or spells.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 12,
  defense: 4,
  basePrice: 80,
  maxRange: 7,
  projectileAnimationKey: AnimationEffectKeys.Blue,
};
