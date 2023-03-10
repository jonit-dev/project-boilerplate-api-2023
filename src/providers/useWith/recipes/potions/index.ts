import { PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeGreaterLifePotion } from "./recipeGreaterLifePotion";
import { recipeGreaterManaPotion } from "./recipeGreaterManaPotion";
import { recipeLightAntidote } from "./recipeLightAntidote";
import { recipeLightEndurancePotion } from "./recipeLightEndurancePotion";
import { recipeLightLifePotion } from "./recipeLightLifePotion";
import { recipeLightManaPotion } from "./recipeLightManaPotion";
import { recipeManaPotion } from "./recipeManaPotion";

export const recipePotionsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [PotionsBlueprint.LightManaPotion]: [recipeLightManaPotion],
  [PotionsBlueprint.GreaterManaPotion]: [recipeGreaterManaPotion],
  [PotionsBlueprint.ManaPotion]: [recipeManaPotion],
  [PotionsBlueprint.LightLifePotion]: [recipeLightLifePotion],
  [PotionsBlueprint.GreaterLifePotion]: [recipeGreaterLifePotion],
  [PotionsBlueprint.LightAntidote]: [recipeLightAntidote],
  [PotionsBlueprint.LightEndurancePotion]: [recipeLightEndurancePotion],
};
