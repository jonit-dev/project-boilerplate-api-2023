import { CraftingResourcesBlueprint, ToolsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCarpentersAxe: IUseWithCraftingRecipe = {
  outputKey: ToolsBlueprint.CarpentersAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 2,
    },
  ],
};
