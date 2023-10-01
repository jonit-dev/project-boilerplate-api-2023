import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeVikingBattleAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.VikingBattleAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 20,
    },
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 15,
    },
    {
      key: CraftingResourcesBlueprint.BatsWing,
      qty: 10,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 5,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 20],
      [CraftingResourcesBlueprint.Leather, 15],
      [CraftingResourcesBlueprint.BatsWing, 10],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 5],
    ]),
  ],
};
