import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemKnightsShield } from "./ItemKnightsShield";
import { ItemPlateShield } from "./ItemPlateShield";
import { itemStuddedShield } from "./ItemStuddedShield";
import { itemWoodenShield } from "./ItemWoodenShield";

export const shieldsBlueprintIndex = {
  [ShieldsBlueprint.WoodenShield]: itemWoodenShield,
  [ShieldsBlueprint.StuddedShield]: itemStuddedShield,
  [ShieldsBlueprint.KnightsShield]: itemKnightsShield,
  [ShieldsBlueprint.PlateShield]: ItemPlateShield,
};
