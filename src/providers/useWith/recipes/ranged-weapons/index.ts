import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeArrow } from "./recipeArrow";
import { recipeBolt } from "./recipeBolt";
import { recipeBow } from "./recipeBow";
import { recipeCrossBow } from "./recipeCrossBow";

export const recipeRangedIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [RangedWeaponsBlueprint.Arrow]: [recipeArrow],
  [RangedWeaponsBlueprint.Bolt]: [recipeBolt],
  [RangedWeaponsBlueprint.Bow]: [recipeBow],
  [RangedWeaponsBlueprint.Crossbow]: [recipeCrossBow],
};
