import { CraftingResourcesBlueprint, FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
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
    {
      key: CraftingResourcesBlueprint.WoodenSticks,
      qty: 5,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Cooking, 4],
};
