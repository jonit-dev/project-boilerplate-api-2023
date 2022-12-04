import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeElvenSword } from "./itemElvenSword";
import { recipeFireSword } from "./recipeFireSword";
import { recipeIceSword } from "./recipeIceSword";

export const recipeSwordsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [CraftingResourcesBlueprint.BlueSapphire]: [recipeIceSword],
  [CraftingResourcesBlueprint.RedShappire]: [recipeFireSword],
  [CraftingResourcesBlueprint.ElvenLeaf]: [recipeElvenSword],
};
