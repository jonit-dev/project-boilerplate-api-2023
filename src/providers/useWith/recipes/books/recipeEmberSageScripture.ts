import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { BooksBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeEmberSageScripture: IUseWithCraftingRecipe = {
  outputKey: BooksBlueprint.EmberSageScripture,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.RedSapphire,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.RedSapphire, 2],
      [CraftingResourcesBlueprint.PhoenixFeather, 2],
      [CraftingResourcesBlueprint.Leather, 3],
    ]),
  ],
};
