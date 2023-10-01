import { FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCheeseSlice: IUseWithCraftingRecipe = {
  outputKey: FoodsBlueprint.CheeseSlice,
  outputQtyRange: [1, 5],
  requiredItems: [
    {
      key: FoodsBlueprint.Milk,
      qty: 2,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Cooking, 2],
};
