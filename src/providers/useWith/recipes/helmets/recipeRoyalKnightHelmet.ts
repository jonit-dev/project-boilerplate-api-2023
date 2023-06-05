import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeRoyalKnightHelmet: IUseWithCraftingRecipe = {
  outputKey: HelmetsBlueprint.RoyalKnightHelmet,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 3],
      [CraftingResourcesBlueprint.Leather, 2],
      [CraftingResourcesBlueprint.SilverIngot, 2],
      [CraftingResourcesBlueprint.BlueFeather, 1],
    ]),
  ],
};
