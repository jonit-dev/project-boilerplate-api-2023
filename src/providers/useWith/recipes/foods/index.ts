import { FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBread } from "./recipeBread";
import { recipeCheese } from "./recipeCheese";
import { recipeCheeseSlice } from "./recipeCheeseSlice";
import { recipeCookie } from "./recipeCookie";
import { recipeRedMeat } from "./recipeRedMeat";

export const recipeFoodsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [FoodsBlueprint.Bread]: [recipeBread],
  [FoodsBlueprint.Cookie]: [recipeCookie],
  [FoodsBlueprint.Cheese]: [recipeCheese],
  [FoodsBlueprint.CheeseSlice]: [recipeCheeseSlice],
  [FoodsBlueprint.RedMeat]: [recipeRedMeat],
};
