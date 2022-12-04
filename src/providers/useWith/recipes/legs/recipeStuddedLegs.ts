import { CraftingResourcesBlueprint, LegsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeStuddedLegs: IUseWithCraftingRecipe = {
  outputKey: LegsBlueprint.StuddedLegs,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.SewingThread,
      qty: 10,
    },
  ],
  successChance: 65,
};
