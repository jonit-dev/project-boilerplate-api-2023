import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeGoldenArmor } from "./recipeGoldenArmor";
import { recipeIronArmor } from "./recipeIronArmor";

export const recipeArmorsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [CraftingResourcesBlueprint.Leather]: [recipeIronArmor],
  [CraftingResourcesBlueprint.GoldenIngot]: [recipeGoldenArmor],
};
