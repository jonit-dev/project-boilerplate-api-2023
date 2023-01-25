import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeBroadSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.BroadSword,
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
