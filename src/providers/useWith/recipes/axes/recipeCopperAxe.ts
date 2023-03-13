import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCopperAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.CopperAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 3,
    },
  ],
};
