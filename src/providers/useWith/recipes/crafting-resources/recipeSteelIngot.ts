import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeSteelIngot: IUseWithCraftingRecipe = {
  outputKey: CraftingResourcesBlueprint.SteelIngot,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 10,
    },
  ],
};
