import { BootsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeGoldenBoots: IUseWithCraftingRecipe = {
  outputKey: BootsBlueprint.GoldenBoots,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 10,
    },
  ],
};
