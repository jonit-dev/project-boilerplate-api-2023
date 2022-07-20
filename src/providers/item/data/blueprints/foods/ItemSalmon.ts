import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSalmon: Partial<IItem> = {
  key: FoodsBlueprint.Salmon,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/salmon.png",
  textureKey: "salmon",
  name: "Salmon",
  description: "A fresh salmon fish.",
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
