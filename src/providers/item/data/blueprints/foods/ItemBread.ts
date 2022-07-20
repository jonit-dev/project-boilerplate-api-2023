import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBread: Partial<IItem> = {
  key: FoodsBlueprint.Bread,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/bread.png",
  textureKey: "bread",
  name: "Bread",
  description: "A loaf of bread.",
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
