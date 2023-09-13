import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipePhoenixWingAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.PhoenixWingAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ObsidiumOre,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.Herb,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ObsidiumOre, 2],
      [CraftingResourcesBlueprint.PhoenixFeather, 6],
      [CraftingResourcesBlueprint.Herb, 1],
    ]),
  ],
};
