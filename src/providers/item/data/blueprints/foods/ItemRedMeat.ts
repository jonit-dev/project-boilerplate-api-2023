import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRedMeat: Partial<IItem> = {
  key: FoodsBlueprint.RedMeat,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/red-meat.png",
  textureKey: "red-meat",
  name: "Red meat",
  description: "This is a red meat from an animal. You can eat it to restore your health.",
  weight: 1,
};
