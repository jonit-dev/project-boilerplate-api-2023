import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { OthersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemMap: Partial<IItem> = {
  key: OthersBlueprint.Map,
  type: ItemType.Other,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "others/map.png",
  name: "Map",
  description: "A map with instructions.",
  weight: 1,
};
