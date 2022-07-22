import { GlovesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemChainGloves } from "./ItemChainGloves";
import { itemLeatherGloves } from "./ItemLeatherGloves";
import { itemPlateGloves } from "./ItemPlateGloves";
import { itemStuddedGloves } from "./ItemStuddedGloves";

export const glovesBlueprintIndex = {
  [GlovesBlueprint.LeatherGloves]: itemLeatherGloves,
  [GlovesBlueprint.StuddedGloves]: itemStuddedGloves,
  [GlovesBlueprint.ChainGloves]: itemChainGloves,
  [GlovesBlueprint.PlateGloves]: itemPlateGloves,
};
