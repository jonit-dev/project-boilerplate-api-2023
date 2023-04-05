import { GlovesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeLeatherGloves } from "./recipeLeatherGloves";

export const recipeGlovesIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [GlovesBlueprint.LeatherGloves]: [recipeLeatherGloves],
};
