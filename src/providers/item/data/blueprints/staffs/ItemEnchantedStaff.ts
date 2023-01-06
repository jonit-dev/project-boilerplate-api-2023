import { IMagicStaff } from "@providers/useWith/useWithTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemEnchantedStaff: Partial<IMagicStaff> = {
  key: StaffsBlueprint.EnchantedStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "staffs/enchanted-staff.png",
  name: "Enchanted Staff",
  description: "A staff imbued with magical powers or enchantments",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 10,
  defense: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 80,
};
