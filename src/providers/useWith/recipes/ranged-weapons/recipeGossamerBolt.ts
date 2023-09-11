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
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.BatsWing,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.SmallWoodenStick,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.CorruptionIngot,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Lumberjacking,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Silk, 20],
      [CraftingResourcesBlueprint.BatsWing, 10],
      [CraftingResourcesBlueprint.SmallWoodenStick, 10],
      [CraftingResourcesBlueprint.CorruptionIngot, 10],
    ]),
  ],
};
