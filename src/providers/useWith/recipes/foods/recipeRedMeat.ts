import { FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeRedMeat: IUseWithCraftingRecipe = {
  outputKey: FoodsBlueprint.RedMeat,
  outputQtyRange: [1, 2],
  requiredItems: [
    {
      key: FoodsBlueprint.RawBeefSteak,
      qty: 2,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Cooking, 1],
};
