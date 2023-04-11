import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, LegsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeLeatherLegs: IUseWithCraftingRecipe = {
  outputKey: LegsBlueprint.LeatherLegs,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 15,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, calculateMinimumLevel([[CraftingResourcesBlueprint.Leather, 15]])],
};
