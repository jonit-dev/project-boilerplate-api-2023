import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeIronwoodTanto: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.IronwoodTanto,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 2,
    },
  ],
};
