import { CraftingResourcesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeRusticFlail: IUseWithCraftingRecipe = {
  outputKey: MacesBlueprint.RusticFlail,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.BatsWing,
      qty: 1,
    },
  ],
};
