import { AxesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeAxe } from "./recipeAxe";
import { recipeDoubleAxe } from "./recipeDoubleAxe";
import { recipeFrostDoubleAxe } from "./recipeFrostDoubleAxe";
import { recipeGlacialAxe } from "./recipeGlacialAxe";
import { recipeGlacialHatchet } from "./recipeGlacialHatchet";
import { recipeRuneAxe } from "./recipeRuneAxe";
import { recipeShadowAxe } from "./recipeShadowAxe";

export const recipeAxesIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [AxesBlueprint.Axe]: [recipeAxe],

  [AxesBlueprint.DoubleAxe]: [recipeDoubleAxe],
  [AxesBlueprint.FrostDoubleAxe]: [recipeFrostDoubleAxe],
  [AxesBlueprint.RuneAxe]: [recipeRuneAxe],
  [AxesBlueprint.ShadowAxe]: [recipeShadowAxe],
  [AxesBlueprint.GlacialAxe]: [recipeGlacialAxe],
  [AxesBlueprint.GlacialHatchet]: [recipeGlacialHatchet],
};
