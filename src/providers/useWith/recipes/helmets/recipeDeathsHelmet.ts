import { CraftingResourcesBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeDeathsHelmet: IUseWithCraftingRecipe = {
  outputKey: HelmetsBlueprint.DeathsHelmet,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.Obsidian,
      qty: 2,
    },
  ],
  successChance: 35,
};
