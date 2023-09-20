import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeParallelPrecisionBow: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.ParallelPrecisionBow,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 30,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.SewingThread,
      qty: 30,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.WoodenSticks, 30],
      [CraftingResourcesBlueprint.Silk, 80],
      [CraftingResourcesBlueprint.ElvenWood, 15],
      [CraftingResourcesBlueprint.SewingThread, 30],
    ]),
  ],
};
