import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeOrcRing: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.OrcRing,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 1,
    },
  ],
};
