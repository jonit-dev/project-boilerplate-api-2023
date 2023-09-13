import { ShieldsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { recipeBladeBarrier } from "./recipeBladeBarrier";
import { recipeCrimsonAegisShield } from "./recipeCrimsonAegisShield";
import { recipeDarkShield } from "./recipeDarkShield";
import { recipeEnergyShield } from "./recipeEnergyShield";
import { recipeForceShield } from "./recipeForceShield";
import { recipeFrostShield } from "./recipeFrostShield";
import { recipeHeatherShield } from "./recipeHeaterShield";
import { recipeHolyShield } from "./recipeHolyShield";
import { recipePaladinsSafeguardShield } from "./recipePaladinsSafeguardShield";
import { recipePaviseShield } from "./recipePaviseShield";
import { recipePlateShield } from "./recipePlateShield";
import { recipeStoneShield } from "./recipeStoneShield";
import { recipeStuddedShield } from "./recipeStuddedShield";
import { recipeTemporalRoundShield } from "./recipeTemporalRoundShield";
import { recipeWardenOfTheWoods } from "./recipeWardenOfTheWoods";
import { recipeWoodenShield } from "./recipeWoodenShield";

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
  [ShieldsBlueprint.WoodenShield]: [recipeWoodenShield],
  [ShieldsBlueprint.StuddedShield]: [recipeStuddedShield],
  [ShieldsBlueprint.BladeBarrier]: [recipeBladeBarrier],
  [ShieldsBlueprint.PaladinsSafeguardShield]: [recipePaladinsSafeguardShield],
  [ShieldsBlueprint.TemporalRoundShield]: [recipeTemporalRoundShield],
  [ShieldsBlueprint.WardenOfTheWoods]: [recipeWardenOfTheWoods],
};
