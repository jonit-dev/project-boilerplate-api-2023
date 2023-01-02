import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeKatana: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.Katana,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 1,
    },
  ],
  successChance: 35,
};
