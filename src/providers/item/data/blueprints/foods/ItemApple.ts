import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemApple: Partial<IItem> = {
  key: FoodsBlueprint.Apple,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/apple.png",
  textureKey: "apple",
  name: "Apple",
  description: "A red apple.",
  weight: 0.05,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
