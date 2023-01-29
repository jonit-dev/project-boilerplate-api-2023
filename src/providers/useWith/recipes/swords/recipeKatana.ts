import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeKatana: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.Katana,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 1,
    },
  ],
};
