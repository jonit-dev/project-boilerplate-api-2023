import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { AxesBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeFrostDoubleAxe: IUseWithCraftingRecipe = {
  outputKey: AxesBlueprint.FrostDoubleAxe,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.IronIngot,
      qty: 25,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 6,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 10,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 25],
      [CraftingResourcesBlueprint.BlueSapphire, 6],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 10],
    ]),
  ],
};
