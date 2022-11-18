import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRawBeefSteak: Partial<IItem> = {
  key: FoodsBlueprint.RawBeefSteak,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/raw-beef-steak.png",
  name: "Raw Beef Steak",
  description: "A raw beef steak that can be used for cooking, but can't be consumed directly.",
  weight: 3,
  maxStackSize: 10,
  basePrice: 20,
  hasUseWith: true,
};
