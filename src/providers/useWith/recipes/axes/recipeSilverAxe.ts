import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeSilverAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.SilverAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 2,
    },
  ],
};
