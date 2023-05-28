import { ContainersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBackpack } from "./recipeBackpack";
import { recipeBag } from "./recipeBag";

export const recipeContainers: Record<string, IUseWithCraftingRecipe[]> = {
  [ContainersBlueprint.Bag]: [recipeBag],
  [ContainersBlueprint.Backpack]: [recipeBackpack],
};
