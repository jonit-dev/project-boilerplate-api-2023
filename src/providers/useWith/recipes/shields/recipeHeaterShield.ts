import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeHeatherShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.HeaterShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 3,
    },
  ],
};
