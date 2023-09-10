import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGossamerBolt: IUseWithCraftingRecipe = {
  outputKey: RangedWeaponsBlueprint.GossamerBolt,
  outputQtyRange: [1, 3],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.BatsWing,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.SmallWoodenStick,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Silk, 2],
      [CraftingResourcesBlueprint.BatsWing, 1],
      [CraftingResourcesBlueprint.SmallWoodenStick, 1],
    ]),
  ],
};
