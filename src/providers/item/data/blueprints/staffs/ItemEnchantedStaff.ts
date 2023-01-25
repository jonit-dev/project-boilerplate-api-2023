import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemEnchantedStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.EnchantedStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  textureAtlas: "items",
  texturePath: "staffs/enchanted-staff.png",
  name: "Enchanted Staff",
  description:
    "A magical staff imbued with powerful enchantments, capable of channeling potent spells and incantations.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 12,
  defense: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 80,
};
