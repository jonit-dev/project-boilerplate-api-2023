import { LegsBlueprint } from "../../types/blueprintTypes";
import { itemLeatherLegs } from "./ItemLeatherLegs";
import { itemStuddedLegs } from "./ItemStuddedLegs";

export const legsBlueprintIndex = {
  [LegsBlueprint.LeatherLegs]: itemLeatherLegs,
  [LegsBlueprint.StuddedLegs]: itemStuddedLegs,
};
