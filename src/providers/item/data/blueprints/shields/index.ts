import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemStuddedShield } from "./ItemStuddedShield";
import { itemWoodenShield } from "./ItemWoodenShield";

export const shieldsBlueprintIndex = {
  [ShieldsBlueprint.WoodenShield]: itemWoodenShield,
  [ShieldsBlueprint.StuddedShield]: itemStuddedShield,
};
