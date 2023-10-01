import { CraftingResourcesBlueprint, FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { CraftingSkill } from "@rpg-engine/shared";
import { IUseWithCraftingRecipe } from "../../useWithTypes";

export const recipeCookie: IUseWithCraftingRecipe = {
  outputKey: FoodsBlueprint.Cookie,
  outputQtyRange: [1, 5],
  requiredItems: [
    {
      key: CraftingResourcesBlueprint.Wheat,
      qty: 1,
    },
    {
      key: FoodsBlueprint.Egg,
      qty: 1,
    },
    {
      key: FoodsBlueprint.Milk,
      qty: 1,
    },
  ],
  minCraftingRequirements: [CraftingSkill.Cooking, 2],
};
