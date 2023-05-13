import { FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCheese: IUseWithCraftingRecipe = {
  outputKey: FoodsBlueprint.Cheese,
  outputQtyRange: [1, 1],
  requiredItems: [
    {
      key: FoodsBlueprint.Milk,
      qty: 0.25,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Cooking, 1],
};
