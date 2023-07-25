import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBandage } from "./recipeBandage";
import { recipeRope } from "./recipeRope";
import { recipeSteelIngot } from "./recipeSteelIngot";
import { recipeWoodenBoard } from "./recipeWoodenBoard";

export const recipeCraftingResources: Record<string, IUseWithCraftingRecipe[]> = {
  [CraftingResourcesBlueprint.SteelIngot]: [recipeSteelIngot],
  [CraftingResourcesBlueprint.Bandage]: [recipeBandage],
  [CraftingResourcesBlueprint.Rope]: [recipeRope],
  [CraftingResourcesBlueprint.WoodenBoard]: [recipeWoodenBoard],
};
