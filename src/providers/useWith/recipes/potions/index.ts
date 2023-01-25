import { PotionsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeGreaterLifePotion } from "./recipeGreaterLifePotion";
import { recipeLightAntidote } from "./recipeLightAntidote";
import { recipeLightEndurancePotion } from "./recipeLightEndurancePotion";
import { recipeLightLifePotion } from "./recipeLightLifePotion";
import { recipeManaPotion } from "./recipeManaPotion";

export const recipePotionsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [PotionsBlueprint.GreaterLifePotion]: [recipeGreaterLifePotion],
  [PotionsBlueprint.LightAntidote]: [recipeLightAntidote],
  [PotionsBlueprint.LightEndurancePotion]: [recipeLightEndurancePotion],
  [PotionsBlueprint.LightLifePotion]: [recipeLightLifePotion],
  [PotionsBlueprint.ManaPotion]: [recipeManaPotion],
};
