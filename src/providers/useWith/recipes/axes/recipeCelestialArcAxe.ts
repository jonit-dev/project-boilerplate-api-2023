import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeCelestialArcAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.CelestialArcAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.SilverIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 50,
    },
    {
      key: CraftingResourcesBlueprint.WoodenBoard,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.GoldenIngot,
      qty: 20,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.SilverIngot, 20],
      [CraftingResourcesBlueprint.BlueSapphire, 50],
      [CraftingResourcesBlueprint.WoodenBoard, 20],
      [CraftingResourcesBlueprint.GoldenIngot, 20],
    ]),
  ],
};
