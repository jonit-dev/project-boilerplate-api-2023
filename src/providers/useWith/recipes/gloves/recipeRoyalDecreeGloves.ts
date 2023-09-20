import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, GlovesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeRoyalDecreeGloves: IUseWithCraftingRecipe = {
  outputKey: GlovesBlueprint.RoyalDecreeGloves,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.Diamond,
      qty: 90,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 100,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 110,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GoldenIngot, 100],
      [CraftingResourcesBlueprint.Diamond, 90],
      [CraftingResourcesBlueprint.Silk, 100],
      [CraftingResourcesBlueprint.PhoenixFeather, 110],
    ]),
  ],
};
