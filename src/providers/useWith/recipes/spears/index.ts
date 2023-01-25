import { SpearsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeSpear } from "./recipeSpear";

export const recipeSpearsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [SpearsBlueprint.Spear]: [recipeSpear],
};
