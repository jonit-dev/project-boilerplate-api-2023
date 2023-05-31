import { StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeCorruptionStaff } from "./recipeCorruptionStaff";
import { recipeEnchantedStaff } from "./recipeEnchantedStaff";
import { recipeFireStaff } from "./recipeFireStaff";
import { recipeRoyalStaff } from "./recipeRoyalStaff";
import { recipeRubyStaff } from "./recipeRubyStaff";
import { recipeSangriaStaff } from "./recipeSangriaStaff";
import { recipeBlueSkyStaff } from "./recipeSkyBlueStaff";
import { recipeTartarusStaff } from "./recipeTartarusStaff";
import { recipeWoodenStaff } from "./recipeWoodenStaff";
import { recipeFireWand } from "./recipeFireWand";
import { recipePoisonWand } from "./recipePoisonWand";

export const recipeStaffsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [StaffsBlueprint.FireStaff]: [recipeFireStaff],
  [StaffsBlueprint.CorruptionStaff]: [recipeCorruptionStaff],
  [StaffsBlueprint.EnchantedStaff]: [recipeEnchantedStaff],
  [StaffsBlueprint.RubyStaff]: [recipeRubyStaff],
  [StaffsBlueprint.SkyBlueStaff]: [recipeBlueSkyStaff],
  [StaffsBlueprint.RoyalStaff]: [recipeRoyalStaff],
  [StaffsBlueprint.SangriaStaff]: [recipeSangriaStaff],
  [StaffsBlueprint.TartarusStaff]: [recipeTartarusStaff],
  [StaffsBlueprint.WoodenStaff]: [recipeWoodenStaff],
  [StaffsBlueprint.FireWand]: [recipeFireWand],
  [StaffsBlueprint.PoisonWand]: [recipePoisonWand],
};
