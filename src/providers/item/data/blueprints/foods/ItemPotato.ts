import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPotato: Partial<IItem> = {
  key: FoodsBlueprint.Potato,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/potato.png",
  textureKey: "potato",
  name: "Potato",
  description: "You see a short sword. It is a single-handed sword with a handle that just features a grip.",
  weight: 10,
};
