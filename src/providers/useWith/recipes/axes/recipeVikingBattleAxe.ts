import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeVikingBattleAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.VikingBattleAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.BatsWing,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 1,
    },
  ],
};
