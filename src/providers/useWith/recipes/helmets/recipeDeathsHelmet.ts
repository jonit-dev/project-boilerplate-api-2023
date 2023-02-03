import { CraftingResourcesBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";

export const recipeDeathsHelmet: IUseWithCraftingRecipe = {
  outputKey: HelmetsBlueprint.DeathsHelmet,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionOre,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Bones,
      qty: 2,
    },
  ],
};
