import { StaffsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeCorruptionStaff } from "./recipeCorruptionStaff";
import { recipeDoomStaff } from "./recipeDoomStaff";
import { recipeEnchantedStaff } from "./recipeEnchantedStaff";
import { recipeFireStaff } from "./recipeFireStaff";
import { recipeFireWand } from "./recipeFireWand";
import { recipeFireburstWand } from "./recipeFireburstWand";
import { recipeGaleforceStaff } from "./recipeGaleforceStaff";
import { recipeHellishBronzeStaff } from "./recipeHellishBronzeStaff";
import { recipeLunarWand } from "./recipeLunarWand";
import { recipeNaturesWand } from "./recipeNaturesWand";
import { recipePoisonWand } from "./recipePoisonWand";
import { recipeRoyalStaff } from "./recipeRoyalStaff";
import { recipeRubyStaff } from "./recipeRubyStaff";
import { recipeSangriaStaff } from "./recipeSangriaStaff";
import { recipeBlueSkyStaff } from "./recipeSkyBlueStaff";
import { recipeSolarStaff } from "./recipeSolarStaff";
import { recipeSpellbinderWand } from "./recipeSpellbinderWand";
import { recipeTartarusStaff } from "./recipeTartarusStaff";
import { recipeVortexStaff } from "./recipeVortexStaff";
import { recipeWinterspireStaff } from "./recipeWinterspireStaff";
import { recipeWoodenStaff } from "./recipeWoodenStaff";

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
  [StaffsBlueprint.DoomStaff]: [recipeDoomStaff],
  [StaffsBlueprint.FireburstWand]: [recipeFireburstWand],
  [StaffsBlueprint.GaleforceStaff]: [recipeGaleforceStaff],
  [StaffsBlueprint.HellishBronzeStaff]: [recipeHellishBronzeStaff],
  [StaffsBlueprint.LunarWand]: [recipeLunarWand],
  [StaffsBlueprint.NaturesWand]: [recipeNaturesWand],
  [StaffsBlueprint.SolarStaff]: [recipeSolarStaff],
  [StaffsBlueprint.SpellbinderWand]: [recipeSpellbinderWand],
  [StaffsBlueprint.VortexStaff]: [recipeVortexStaff],
  [StaffsBlueprint.WinterspireStaff]: [recipeWinterspireStaff],
};
