import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipePoisonWand: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.PoisonWand,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.BlueSapphire,
      qty: 4,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 2,
    },
    {
      key: CraftingResourcesBlueprint.CopperIngot,
      qty: 4,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.BlueSapphire, 4],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 2],
      [CraftingResourcesBlueprint.CopperIngot, 4],
    ]),
  ],
};
