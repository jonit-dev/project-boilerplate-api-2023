import { LegsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBloodfireLegs } from "./recipeBloodfireLegs";
import { recipeBlueLegs } from "./recipeBlueLegs";
import { recipeDwarvenLegs } from "./recipeDwarvenLegs";
import { recipeFalconLegs } from "./recipeFalconLegs";
import { recipeHoneyGlowLegs } from "./recipeHoneyGlowLegs";
import { recipeIvoryMoonLegs } from "./recipeIvoryMoonLegs";
import { recipeLeatherLegs } from "./recipeLeatherLegs";
import { recipeRustedIronLegs } from "./recipeRustedIronLegs";
import { recipeSilvershadeLegs } from "./recipeSilvershadeLegs";
import { recipeSolarflareLegs } from "./recipeSolarflareLegs";
import { recipeStuddedLegs } from "./recipeStuddedLegs";
import { recipeTempestLegs } from "./recipeTempestLegs";

export const recipeLegsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [LegsBlueprint.StuddedLegs]: [recipeStuddedLegs],
  [LegsBlueprint.BloodfireLegs]: [recipeBloodfireLegs],
  [LegsBlueprint.FalconsLegs]: [recipeFalconLegs],
  [LegsBlueprint.LeatherLegs]: [recipeLeatherLegs],
  [LegsBlueprint.BlueLegs]: [recipeBlueLegs],
  [LegsBlueprint.DwarvenLegs]: [recipeDwarvenLegs],
  [LegsBlueprint.HoneyGlowLegs]: [recipeHoneyGlowLegs],
  [LegsBlueprint.IvoryMoonLegs]: [recipeIvoryMoonLegs],
  [LegsBlueprint.RustedIronLegs]: [recipeRustedIronLegs],
  [LegsBlueprint.SilvershadeLegs]: [recipeSilvershadeLegs],
  [LegsBlueprint.SolarflareLegs]: [recipeSolarflareLegs],
  [LegsBlueprint.TempestLegs]: [recipeTempestLegs],
};
