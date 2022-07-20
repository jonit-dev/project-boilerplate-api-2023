import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCookie: Partial<IItem> = {
  key: FoodsBlueprint.Cookie,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/cookie.png",
  textureKey: "cookie",
  name: "Cookie",
  description: "A baked cookie.",
  weight: 0.05,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
