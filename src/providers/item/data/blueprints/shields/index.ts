import { ShieldsBlueprint } from "../../types/blueprintTypes";
import { itemWoodenShield } from "./ItemWoodenShield";
import { itemStuddedShield } from "./ItemStuddedShield";

export const shieldsBlueprintIndex = {
  [ShieldsBlueprint.WoodenShield]: itemWoodenShield,
  [ShieldsBlueprint.StuddedShield]: itemStuddedShield,
};
