import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, GlovesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGlovesOfGrace: IUseWithCraftingRecipe = {
  outputKey: GlovesBlueprint.GlovesOfGrace,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.ElvenLeaf,
      qty: 80,
    },
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.GoldenOre,
      qty: 40,
    },
    {
      key: CraftingResourcesBlueprint.PhoenixFeather,
      qty: 50,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.ElvenLeaf, 80],
      [CraftingResourcesBlueprint.Silk, 50],
      [CraftingResourcesBlueprint.GoldenOre, 40],
      [CraftingResourcesBlueprint.PhoenixFeather, 50],
    ]),
  ],
};
