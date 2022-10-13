import { CraftingResourcesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBlueFeather } from "./ItemBlueFeather";
import { itemBlueSapphire } from "./ItemBlueSapphire";

export const craftingResourcesBlueprintIndex = {
  [CraftingResourcesBlueprint.BlueSapphire]: itemBlueSapphire,
  [CraftingResourcesBlueprint.BlueFeather]: itemBlueFeather,
};
