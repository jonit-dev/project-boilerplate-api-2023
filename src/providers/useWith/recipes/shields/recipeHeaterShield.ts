import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeHeatherShield: IUseWithCraftingRecipe = {
  outputKey: ShieldsBlueprint.HeaterShield,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.CopperIngot, 3],
      [CraftingResourcesBlueprint.BlueSapphire, 3],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 3],
    ]),
  ],
};
