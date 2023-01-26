import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeFrostDoubleAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.FrostDoubleAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.WolfTooth,
      qty: 2,
    },
  ],
};
