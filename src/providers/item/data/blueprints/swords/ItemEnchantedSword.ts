import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemEnchantedSword: Partial<IItem> = {
  key: SwordsBlueprint.EnchantedSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/enchanted-sword.png",
  name: "Enchanted Sword",
  description: "A sword imbued with magical powers or enchantments",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 12,
  defense: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 78,
};
