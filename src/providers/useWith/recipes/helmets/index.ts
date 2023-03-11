import { HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBerserkersHelmet } from "./recipeBerserkersHelmet";
import { recipeBloodfireHelmet } from "./recipeBloodfireHelmet";
import { recipeDeathsHelmet } from "./recipeDeathsHelmet";
import { recipeGuardianHelmet } from "./recipeGuardianHelmet";
import { recipeInfantryHelmet } from "./recipeInfantryHelmet";
import { recipeIroncladHelmet } from "./recipeIroncladHelmet";
import { recipeRoyalKnightHelmet } from "./recipeRoyalKnightHelmet";
import { recipeTurban } from "./recipeTurban";
import { recipeVikingHelmet } from "./recipeVikingHelmet";
import { recipeWizardHat } from "./recipeWizardHat";

export const recipeHelmetsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [HelmetsBlueprint.BerserkersHelmet]: [recipeBerserkersHelmet],
  [HelmetsBlueprint.DeathsHelmet]: [recipeDeathsHelmet],
  [HelmetsBlueprint.InfantryHelmet]: [recipeInfantryHelmet],
  [HelmetsBlueprint.RoyalKnightHelmet]: [recipeRoyalKnightHelmet],
  [HelmetsBlueprint.Turban]: [recipeTurban],
  [HelmetsBlueprint.VikingHelmet]: [recipeVikingHelmet],
  [HelmetsBlueprint.WizardHat]: [recipeWizardHat],
  [HelmetsBlueprint.BloodfireHelmet]: [recipeBloodfireHelmet],
  [HelmetsBlueprint.GuardianHelmet]: [recipeGuardianHelmet],
  [HelmetsBlueprint.IroncladHelmet]: [recipeIroncladHelmet],
};
