import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeMithrilSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.MithrilSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 1,
    },
  ],
};
