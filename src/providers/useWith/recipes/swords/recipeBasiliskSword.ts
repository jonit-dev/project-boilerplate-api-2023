import { CraftingResourcesBlueprint, SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeBasiliskSword: IUseWithCraftingRecipe = {
  outputKey: SwordsBlueprint.BasiliskSword,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.GreenOre,
      qty: 3,
    },
  ],
  successChance: 10,
};
