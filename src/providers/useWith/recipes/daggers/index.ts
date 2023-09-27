import { DaggersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeFrostDagger } from "./recipeFrostDagger";
import { recipeHexBladeDagger } from "./recipeHexBladeDagger";
import { recipeSpiritBlade } from "./recipeSpiritBlade";
import { recipeWoodenDagger } from "./recipeWoodenDagger";
import { recipeAzureDagger } from "./recipeAzureDagger";
import { recipeGoldenDagger } from "./recipeGoldenDagger";

export const recipeDaggersIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [DaggersBlueprint.FrostDagger]: [recipeFrostDagger],
  [DaggersBlueprint.WoodenDagger]: [recipeWoodenDagger],
  [DaggersBlueprint.HexBladeDagger]: [recipeHexBladeDagger],
  [DaggersBlueprint.SpiritBlade]: [recipeSpiritBlade],
  [DaggersBlueprint.AzureDagger]: [recipeAzureDagger],
  [DaggersBlueprint.GoldenDagger]: [recipeGoldenDagger],
};
