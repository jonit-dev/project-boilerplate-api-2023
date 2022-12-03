import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeTurban } from "./recipeTurban";
import { recipeWizardHat } from "./recipeWizardHat";

export const recipeHelmetsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [CraftingResourcesBlueprint.Silk]: [recipeTurban],
  [CraftingResourcesBlueprint.BlueSilk]: [recipeWizardHat],
};
