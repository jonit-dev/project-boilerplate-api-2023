import { ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeFrostShield } from "./recipeFrostShield";
import { recipePlateShield } from "./recipePlateShield";
import { recipeWoodenShield } from "./recipWoodenShield";

export const recipeShieldsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [ShieldsBlueprint.WoodenShield]: [recipeWoodenShield],
  [ShieldsBlueprint.FrostShield]: [recipeFrostShield],
  [ShieldsBlueprint.PlateShield]: [recipePlateShield],
};
