import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWolfTooth: Partial<IItem> = {
  key: CraftingResourcesBlueprint.WolfTooth,
  type: ItemType.CraftMaterial,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "crafting-resources/wolf-tooth.png",
  name: "Wolf Tooth",
  description: "A crafting material used as a magic reagent.",
  weight: 0.01,
  maxStackSize: 100,
  sellPrice: 10,
};
