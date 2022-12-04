import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeWoodenShield } from "./recipWoodenShield";

export const recipeShieldsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [CraftingResourcesBlueprint.WoodenBoard]: [recipeWoodenShield],
};
