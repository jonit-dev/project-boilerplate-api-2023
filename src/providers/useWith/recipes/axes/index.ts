import { AxesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeAxe } from "./recipeAxe";
import { recipeCopperAxe } from "./recipeCopperAxe";
import { recipeDoubleAxe } from "./recipeDoubleAxe";
import { recipeFrostDoubleAxe } from "./recipeFrostDoubleAxe";
import { recipeGlacialAxe } from "./recipeGlacialAxe";
import { recipeGlacialHatchet } from "./recipeGlacialHatchet";
import { recipeRuneAxe } from "./recipeRuneAxe";
import { recipeShadowAxe } from "./recipeShadowAxe";
import { recipeSilverAxe } from "./recipeSilverAxe";
import { recipeVikingBattleAxe } from "./recipeVikingBattleAxe";
import { recipeWhiteRavenAxe } from "./recipeWhiteRavenAxe";

export const recipeAxesIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [AxesBlueprint.Axe]: [recipeAxe],

  [AxesBlueprint.DoubleAxe]: [recipeDoubleAxe],
  [AxesBlueprint.FrostDoubleAxe]: [recipeFrostDoubleAxe],
  [AxesBlueprint.RuneAxe]: [recipeRuneAxe],
  [AxesBlueprint.ShadowAxe]: [recipeShadowAxe],
  [AxesBlueprint.CopperAxe]: [recipeCopperAxe],
  [AxesBlueprint.SilverAxe]: [recipeSilverAxe],
  [AxesBlueprint.VikingBattleAxe]: [recipeVikingBattleAxe],
  [AxesBlueprint.WhiteRavenAxe]: [recipeWhiteRavenAxe],
  [AxesBlueprint.GlacialAxe]: [recipeGlacialAxe],
  [AxesBlueprint.GlacialHatchet]: [recipeGlacialHatchet],
};
