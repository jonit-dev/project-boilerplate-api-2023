import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBandana } from "./recipeBandana";

export const recipeAccessoriesIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [CraftingResourcesBlueprint.SewingThread]: [recipeBandana],
};
