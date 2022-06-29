import { GlovesBlueprint } from "../../types/blueprintTypes";
import { itemLeatherGloves } from "./ItemLeatherGloves";
import { itemStuddedGloves } from "./ItemStuddedGloves";

export const glovesBlueprintIndex = {
  [GlovesBlueprint.LeatherGloves]: itemLeatherGloves,
  [GlovesBlueprint.StuddedGloves]: itemStuddedGloves,
};
