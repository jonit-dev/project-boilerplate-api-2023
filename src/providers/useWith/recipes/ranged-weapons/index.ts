import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeArrow } from "./recipeArrow";
import { recipeBolt } from "./recipeBolt";
import { recipeBow } from "./recipeBow";
import { recipeCrossBow } from "./recipeCrossBow";

export const recipeRangedIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [CraftingResourcesBlueprint.Feather]: [recipeArrow],
  [CraftingResourcesBlueprint.SmallWoodenStick]: [recipeBolt],
  [CraftingResourcesBlueprint.Rope]: [recipeBow],
  [CraftingResourcesBlueprint.GreaterWoodenLog]: [recipeCrossBow],
};
