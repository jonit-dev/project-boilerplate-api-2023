import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeGlacialAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.GlacialAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SteelIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreenIngot,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SteelIngot, 10],
      [CraftingResourcesBlueprint.GoldenIngot, 10],
      [CraftingResourcesBlueprint.BlueSapphire, 10],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 10],
    ]),
  ],
};
