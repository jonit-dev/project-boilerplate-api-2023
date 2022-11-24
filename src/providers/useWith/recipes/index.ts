import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../useWithTypes";
import { recipeArrow } from "./recipeArrow";

export const recipeBlueprintsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [CraftingResourcesBlueprint.WoodenSticks]: [recipeArrow],
};
