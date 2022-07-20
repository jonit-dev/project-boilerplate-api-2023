import { GlovesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemLeatherGloves } from "./ItemLeatherGloves";
import { itemStuddedGloves } from "./ItemStuddedGloves";

export const glovesBlueprintIndex = {
  [GlovesBlueprint.LeatherGloves]: itemLeatherGloves,
  [GlovesBlueprint.StuddedGloves]: itemStuddedGloves,
};
