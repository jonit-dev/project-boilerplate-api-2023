import { ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeCrimsonAegisShield } from "./recipeCrimsonAegisShield";
import { recipeDarkShield } from "./recipeDarkShield";
import { recipeEnergyShield } from "./recipeEnergyShield";
import { recipeForceShield } from "./recipeForceShield";
import { recipeFrostShield } from "./recipeFrostShield";
import { recipeHeatherShield } from "./recipeHeaterShield";
import { recipeHolyShield } from "./recipeHolyShield";
import { recipePaviseShield } from "./recipePaviseShield";
import { recipePlateShield } from "./recipePlateShield";
import { recipeStoneShield } from "./recipeStoneShield";

export const recipeShieldsIndex: Record<string, IUseWithCraftingRecipe[]> = {
  [ShieldsBlueprint.FrostShield]: [recipeFrostShield],
  [ShieldsBlueprint.PlateShield]: [recipePlateShield],
  [ShieldsBlueprint.DarkShield]: [recipeDarkShield],
  [ShieldsBlueprint.EnergyShield]: [recipeEnergyShield],
  [ShieldsBlueprint.ForceShield]: [recipeForceShield],
  [ShieldsBlueprint.HeaterShield]: [recipeHeatherShield],
  [ShieldsBlueprint.HolyShield]: [recipeHolyShield],
  [ShieldsBlueprint.StoneShield]: [recipeStoneShield],
  [ShieldsBlueprint.PaviseShield]: [recipePaviseShield],
  [ShieldsBlueprint.CrimsonAegisShield]: [recipeCrimsonAegisShield],
};
