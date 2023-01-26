import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.Axe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 5,
    },
  ],
};
