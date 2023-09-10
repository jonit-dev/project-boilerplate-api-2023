import { HammersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeMedievalCrossedHammer } from "./recipeMedievalCrossedHammer";
import { recipeSledgeHammer } from "./recipeSledgeHammer";

export const recipeHammersIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [HammersBlueprint.MedievalCrossedHammer]: [recipeMedievalCrossedHammer],
  [HammersBlueprint.SledgeHammer]: [recipeSledgeHammer],
};
