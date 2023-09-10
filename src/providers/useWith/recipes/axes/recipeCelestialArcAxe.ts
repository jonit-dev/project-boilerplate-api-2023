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
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.ElvenWood,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Silk, 5],
      [CraftingResourcesBlueprint.BlueSapphire, 6],
      [CraftingResourcesBlueprint.ElvenWood, 2],
    ]),
  ],
};
