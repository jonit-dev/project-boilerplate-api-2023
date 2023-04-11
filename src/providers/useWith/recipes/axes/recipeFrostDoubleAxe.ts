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
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 2,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Blacksmithing,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.IronIngot, 4],
      [CraftingResourcesBlueprint.BlueSapphire, 2],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 2],
    ]),
  ],
};
