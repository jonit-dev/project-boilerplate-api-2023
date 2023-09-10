import { AxesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeAxe } from "./recipeAxe";
import { recipeCelestialArcAxe } from "./recipeCelestialArcAxe";
import { recipeCopperAxe } from "./recipeCopperAxe";
import { recipeDoubleAxe } from "./recipeDoubleAxe";
import { recipeFrostDoubleAxe } from "./recipeFrostDoubleAxe";
import { recipeGlacialAxe } from "./recipeGlacialAxe";
import { recipeGlacialHatchet } from "./recipeGlacialHatchet";
import { recipeGloriousAxe } from "./recipeGloriousAxe";
import { recipeGoldenReaverAxe } from "./recipeGoldenReaverAxe";
import { recipeGrandSanguineBattleaxe } from "./recipeGrandSanguineBattleaxe";
import { recipeHydraSlayerAxe } from "./recipeHydraSlayerAxe";
import { recipePhoenixWingAxe } from "./recipePhoenixWingAxe";
import { recipeRuneAxe } from "./recipeRuneAxe";
import { recipeRustBreakerAxe } from "./recipeRustBreakerAxe";
import { recipeShadowAxe } from "./recipeShadowAxe";
import { recipeSilentScreamAxe } from "./recipeSilentScreamAxe";
import { recipeSilverAxe } from "./recipeSilverAxe";
import { recipeVikingBattleAxe } from "./recipeVikingBattleAxe";
import { recipeWhiteRavenAxe } from "./recipeWhiteRavenAxe";
import { recipeWoodenAxe } from "./recipeWoodenAxe";

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
  [AxesBlueprint.WoodenAxe]: [recipeWoodenAxe],
  [AxesBlueprint.CelestialArcAxe]: [recipeCelestialArcAxe],
  [AxesBlueprint.GloriousAxe]: [recipeGloriousAxe],
  [AxesBlueprint.GoldenReaverAxe]: [recipeGoldenReaverAxe],
  [AxesBlueprint.GrandSanguineBattleaxe]: [recipeGrandSanguineBattleaxe],
  [AxesBlueprint.HydraSlayerAxe]: [recipeHydraSlayerAxe],
  [AxesBlueprint.PhoenixWingAxe]: [recipePhoenixWingAxe],
  [AxesBlueprint.RustBreakerAxe]: [recipeRustBreakerAxe],
  [AxesBlueprint.SilentScreamAxe]: [recipeSilentScreamAxe],
};
