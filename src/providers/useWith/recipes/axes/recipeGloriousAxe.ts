import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGloriousAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.GloriousAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 9,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.PolishedStone,
      qty: 7,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 9],
      [CraftingResourcesBlueprint.Diamond, 5],
      [CraftingResourcesBlueprint.PolishedStone, 7],
    ]),
  ],
};
