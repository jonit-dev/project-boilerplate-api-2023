import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemCandle: Partial<IItem> = {
  key: "candle",
  type: ItemType.Other,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "others/candle.png",
  textureKey: "candle",
  name: "Candle",
  description: "A wax candle.",
  weight: 0.05,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};