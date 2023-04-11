import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { ArmorsBlueprint, CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeJacket: IUseWithCraftingRecipe = {
  outputKey: ArmorsBlueprint.Jacket,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Silk,
      qty: 5,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Blacksmithing, calculateMinimumLevel([[CraftingResourcesBlueprint.Silk, 5]])],
};
