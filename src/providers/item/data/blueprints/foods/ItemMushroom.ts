import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemMushroom: Partial<IItem> = {
  key: FoodsBlueprint.Mushroom,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/mushroom.png",
  textureKey: "mushroom",
  name: "Mushroom",
  description: "An edible mushroom that can be eaten to restore health.",
  weight: 0.25,
};
