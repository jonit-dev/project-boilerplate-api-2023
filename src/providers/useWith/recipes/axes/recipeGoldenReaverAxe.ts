import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGoldenReaverAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.GoldenReaverAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 15],
      [CraftingResourcesBlueprint.PolishedStone, 20],
      [CraftingResourcesBlueprint.Leather, 10],
    ]),
  ],
};
