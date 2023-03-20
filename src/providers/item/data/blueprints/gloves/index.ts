import { GlovesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemLeatherGloves } from "./tier0/ItemLeatherGloves";
import { itemStuddedGloves } from "./tier1/ItemStuddedGloves";
import { itemChainGloves } from "./tier2/ItemChainGloves";
import { itemPlateGloves } from "./tier3/ItemPlateGloves";

export const glovesBlueprintIndex = {
  [GlovesBlueprint.LeatherGloves]: itemLeatherGloves,
  [GlovesBlueprint.StuddedGloves]: itemStuddedGloves,
  [GlovesBlueprint.ChainGloves]: itemChainGloves,
  [GlovesBlueprint.PlateGloves]: itemPlateGloves,
};
