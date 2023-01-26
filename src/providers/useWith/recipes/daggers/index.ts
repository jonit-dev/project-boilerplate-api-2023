import { DaggersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeFrostDagger } from "./recipeFrostDagger";

export const recipeDaggersIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [DaggersBlueprint.FrostDagger]: [recipeFrostDagger],
};
