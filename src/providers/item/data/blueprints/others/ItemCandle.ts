import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { OthersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCandle: Partial<IItem> = {
  key: OthersBlueprint.Candle,
  type: ItemType.Other,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "others/candle.png",

  name: "Candle",
  description: "A wax candle.",
  weight: 0.05,
  allowedEquipSlotType: [ItemSlotType.Ring],
};
