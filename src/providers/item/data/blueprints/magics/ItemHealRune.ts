import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHealRune: Partial<IItem> = {
  key: MagicsBlueprint.HealRune,
  type: ItemType.Accessory,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/heal-rune.png",

  name: "Healing Rune",
  description: "An ancient healing rune.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Accessory, ItemSlotType.Inventory],
  basePrice: 20,
};
