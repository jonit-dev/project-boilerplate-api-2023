import { FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBread } from "./recipeBread";

export const recipeFoodsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [FoodsBlueprint.Bread]: [recipeBread],
};
