import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { AnimationEffectKeys, EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemEnchantedStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.EnchantedStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  textureAtlas: "items",
  texturePath: "staffs/enchanted-staff.png",
  name: "Enchanted Staff",
  description:
    "A magical staff imbued with powerful enchantments, capable of channeling potent spells and incantations.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 14,
  defense: 7,
  maxRange: 8,
  basePrice: 80,
  isTwoHanded: true,
};
