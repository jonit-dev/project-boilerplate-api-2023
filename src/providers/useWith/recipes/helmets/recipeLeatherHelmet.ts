import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeLeatherHelmet: IUseWithCraftingRecipe = {
  outputKey: HelmetsBlueprint.LeatherHelmet,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 12,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, calculateMinimumLevel([[CraftingResourcesBlueprint.Leather, 12]])],
};
