import { DaggersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeFrostDagger } from "./recipeFrostDagger";
import { recipeHexBladeDagger } from "./recipeHexBladeDagger";
import { recipeSpiritBlade } from "./recipeSpiritBlade";
import { recipeWoodenDagger } from "./recipeWoodenDagger";

export const recipeDaggersIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [DaggersBlueprint.FrostDagger]: [recipeFrostDagger],
  [DaggersBlueprint.WoodenDagger]: [recipeWoodenDagger],
  [DaggersBlueprint.HexBladeDagger]: [recipeHexBladeDagger],
  [DaggersBlueprint.SpiritBlade]: [recipeSpiritBlade],
};
