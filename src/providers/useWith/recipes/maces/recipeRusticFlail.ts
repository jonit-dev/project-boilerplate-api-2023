import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeRusticFlail: IUseWithCraftingRecipe = {
  outputKey: MacesBlueprint.RusticFlail,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 1,
    },
    {
      key: CraftingResourcesBlueprint.BatsWing,
      qty: 1,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.GreaterWoodenLog, 2],
      [CraftingResourcesBlueprint.Leather, 1],
      [CraftingResourcesBlueprint.BatsWing, 1],
    ]),
  ],
};
