import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemFrostShield } from "./ItemFrostShield";
import { itemKnightsShield } from "./ItemKnightsShield";
import { itemPlaceShield } from "./ItemPlateShield";
import { itemScutumShield } from "./ItemScutumShield";
import { itemSilverShield } from "./ItemSilverShield";
import { itemStuddedShield } from "./ItemStuddedShield";
import { itemVikingShield } from "./ItemVikingShield";
import { itemWoodenShield } from "./ItemWoodenShield";
import { itemYetiShield } from "./ItemYetiShield";

export const shieldsBlueprintIndex = {
  [ShieldsBlueprint.FrostShield]: itemFrostShield,
  [ShieldsBlueprint.KnightsShield]: itemKnightsShield,
  [ShieldsBlueprint.PlateShield]: itemPlaceShield,
  [ShieldsBlueprint.ScutumShield]: itemScutumShield,
  [ShieldsBlueprint.SilverShield]: itemSilverShield,
  [ShieldsBlueprint.StuddedShield]: itemStuddedShield,
  [ShieldsBlueprint.VikingShield]: itemVikingShield,
  [ShieldsBlueprint.WoodenShield]: itemWoodenShield,
  [ShieldsBlueprint.YetiShield]: itemYetiShield,
};
