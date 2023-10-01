import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeBlueSkyStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.SkyBlueStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.BlueFeather,
      qty: 8,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.BlueSilk,
      qty: 3,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueSapphire, 8],
      [CraftingResourcesBlueprint.BlueFeather, 8],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 4],
      [CraftingResourcesBlueprint.BlueSilk, 3],
    ]),
  ],
};
