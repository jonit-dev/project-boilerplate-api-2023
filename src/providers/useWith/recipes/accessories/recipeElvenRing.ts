import { AccessoriesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeElvenRing: IUseWithCraftingRecipe = {
  outputKey: AccessoriesBlueprint.ElvenRing,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 2,
    },
  ],
};
