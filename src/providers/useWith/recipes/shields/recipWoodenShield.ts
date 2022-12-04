import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeWoodenShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.WoodenShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 2,
    },
  ],
  successChance: 65,
};
