import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCorruptionStaff: IUseWithCraftingRecipe = {
  outputKey: StaffsBlueprint.CorruptionStaff,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Jade,
      qty: 5,
    },
    {
      key: CraftingResourcesBlueprint.GreaterWoodenLog,
      qty: 3,
    },
    {
      key: CraftingResourcesBlueprint.MagicRecipe,
      qty: 6,
    },
  ],
  minCraftingRequirements: [
    CraftingSkill.Alchemy,
    calculateMinimumLevel([
      [CraftingResourcesBlueprint.Jade, 5],
      [CraftingResourcesBlueprint.GreaterWoodenLog, 3],
      [CraftingResourcesBlueprint.MagicRecipe, 6],
    ]),
  ],
};
