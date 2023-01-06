import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHasteRing: Partial<IItem> = {
  key: AccessoriesBlueprint.HasteRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/haste-ring.png",
  name: "Haste Ring",
  description: "a golden ring crafted by a elf master craftsman.",
  attack: 2,
  defense: 1,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 40,
};
