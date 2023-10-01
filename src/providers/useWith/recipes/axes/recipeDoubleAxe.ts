import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeDoubleAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.DoubleAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 25,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 25],
      [CraftingResourcesBlueprint.WoodenSticks, 20],
      [CraftingResourcesBlueprint.Leather, 25],
    ]),
  ],
};
