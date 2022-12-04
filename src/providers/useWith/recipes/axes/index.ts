import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeAxe } from "./recipeAxe";

export const recipeAxesIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [CraftingResourcesBlueprint.PolishedStone]: [recipeAxe],
};
