import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBatsWing } from "./ItemBatsWing";
import { itemBlueFeather } from "./ItemBlueFeather";
import { itemBlueSapphire } from "./ItemBlueSapphire";
import { itemLeather } from "./ItemLeather";

export const craftingResourcesBlueprintIndex = {
  [CraftingResourcesBlueprint.BlueSapphire]: itemBlueSapphire,
  [CraftingResourcesBlueprint.BlueFeather]: itemBlueFeather,
  [CraftingResourcesBlueprint.Leather]: itemLeather,
  [CraftingResourcesBlueprint.BatsWing]: itemBatsWing,
};
