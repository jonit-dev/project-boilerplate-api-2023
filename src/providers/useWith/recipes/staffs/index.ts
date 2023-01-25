import { StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeCorruptionStaff } from "./recipeCorruptionStaff";
import { recipeFireStaff } from "./recipeFireStaff";

export const recipeStaffsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [StaffsBlueprint.FireStaff]: [recipeFireStaff],
  [StaffsBlueprint.CorruptionStaff]: [recipeCorruptionStaff],
};
