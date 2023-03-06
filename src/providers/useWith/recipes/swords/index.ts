import { SwordsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBasiliskSword } from "./recipeBasiliskSword";
import { recipeBroadSword } from "./recipeBroadSword";
import { recipeCorruptionSword } from "./recipeCorruptionSword";
import { recipeElvenSword } from "./recipeElvenSword";
import { recipeFireSword } from "./recipeFireSword";
import { recipeIceSword } from "./recipeIceSword";
import { recipeKatana } from "./recipeKatana";
import { recipeMithrilSword } from "./recipeMithrilSword";

export const recipeSwordsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [SwordsBlueprint.ElvenSword]: [recipeElvenSword],
  [SwordsBlueprint.FireSword]: [recipeFireSword],
  [SwordsBlueprint.IceSword]: [recipeIceSword],
  [SwordsBlueprint.BasiliskSword]: [recipeBasiliskSword],
  [SwordsBlueprint.BroadSword]: [recipeBroadSword],
  [SwordsBlueprint.Katana]: [recipeKatana],
  [SwordsBlueprint.MithrilSword]: [recipeMithrilSword],
  [SwordsBlueprint.CorruptionSword]: [recipeCorruptionSword],
};
