import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { CraftingResourcesBlueprint, GlovesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

export const recipeLeatherGloves: IUseWithCraftingRecipe = {
  outputKey: GlovesBlueprint.LeatherGloves,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Leather,
      qty: 10,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Alchemy, calculateMinimumLevel([[CraftingResourcesBlueprint.Leather, 10]])],
};
