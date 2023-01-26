import { AxesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeAxe } from "./recipeAxe";
import { recipeDoubleAxe } from "./recipeDoubleAxe";
import { recipeFrostDoubleAxe } from "./recipeFrostDoubleAxe";

export const recipeAxesIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [AxesBlueprint.Axe]: [recipeAxe],
  [AxesBlueprint.DoubleAxe]: [recipeDoubleAxe],
  [AxesBlueprint.FrostDoubleAxe]: [recipeFrostDoubleAxe],
};
