import { calculateMinimumLevel } from "@providers/crafting/CraftingMinLevelCalculator";
import { FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCheeseSlice: IUseWithCraftingRecipe = {
  outputKey: FoodsBlueprint.CheeseSlice,
  outputQtyRange: [1, 5],
  requiredItems: [
    {
      key: FoodsBlueprint.Milk,
      qty: 0.1,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Cooking, calculateMinimumLevel([[FoodsBlueprint.Milk, 0.1]])],
};
