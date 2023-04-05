import { MacesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBloodstainedCenser } from "./recipeBloodstainedCenser";
import { recipeMace } from "./recipeMace";
import { recipeRusticFlail } from "./recipeRusticFlail";
import { recipeSilverBulbMace } from "./recipeSilverBulbMace";
import { recipeSpikedClub } from "./recipeSpikedClub";
import { recipeWoodenMace } from "./recipeWoodenMace";

export const recipeMacesIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [MacesBlueprint.SpikedClub]: [recipeSpikedClub],
  [MacesBlueprint.Mace]: [recipeMace],
  [MacesBlueprint.BloodstainedCenser]: [recipeBloodstainedCenser],
  [MacesBlueprint.RusticFlail]: [recipeRusticFlail],
  [MacesBlueprint.SilverBulbMace]: [recipeSilverBulbMace],
  [MacesBlueprint.WoodenMace]: [recipeWoodenMace],
};
