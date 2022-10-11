import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemFrostShield } from "./ItemFrostShield";
import { itemKnightsShield } from "./ItemKnightsShield";
import { itemPlaceShield } from "./ItemPlateShield";
import { itemStuddedShield } from "./ItemStuddedShield";
import { itemVikingShield } from "./ItemVikingShield";
import { itemWoodenShield } from "./ItemWoodenShield";
import { itemYetiShield } from "./ItemYetiShield";

export const shieldsBlueprintIndex = {
  [ShieldsBlueprint.WoodenShield]: itemWoodenShield,
  [ShieldsBlueprint.StuddedShield]: itemStuddedShield,
  [ShieldsBlueprint.KnightsShield]: itemKnightsShield,
  [ShieldsBlueprint.PlateShield]: itemPlaceShield,
  [ShieldsBlueprint.VikingShield]: itemVikingShield,
  [ShieldsBlueprint.FrostShield]: itemFrostShield,
  [ShieldsBlueprint.YetiShield]: itemYetiShield,
};
