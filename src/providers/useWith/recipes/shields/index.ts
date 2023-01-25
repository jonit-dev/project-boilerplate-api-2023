import { ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeWoodenShield } from "./recipWoodenShield";
import { recipeFrostShield } from "./recipeFrostShield";
import { recipePlateShield } from "./recipePlateShield";

export const recipeShieldsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [ShieldsBlueprint.WoodenShield]: [recipeWoodenShield],
  [ShieldsBlueprint.FrostShield]: [recipeFrostShield],
  [ShieldsBlueprint.PlateShield]: [recipePlateShield],
};
