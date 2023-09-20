import { GlovesBlueprint } from "../../types/itemsBlueprintTypes";
import { itemLeatherGloves } from "./tier0/ItemLeatherGloves";
import { itemStuddedGloves } from "./tier1/ItemStuddedGloves";
import { itemFrostwardenGloves } from "./tier10/ItemFrostwardenGloves";
import { itemRoyalDecreeGloves } from "./tier10/ItemRoyalDecreeGloves";
import { itemPyroclasmGloves } from "./tier11/ItemPyroclasmGloves";
import { itemOsirisGloves } from "./tier12/ItemOsirisGloves";
import { itemShadowlordGloves } from "./tier12/ItemShadowlordGloves";
import { itemGenesisGloves } from "./tier13/ItemGenesisGloves";
import { itemChainGloves } from "./tier2/ItemChainGloves";
import { itemPlateGloves } from "./tier3/ItemPlateGloves";
import { itemGleamingGauntlets } from "./tier6/ItemGleamingGauntlets";
import { itemGlovesOfGrace } from "./tier6/ItemGlovesOfGrace";
import { itemCrimsonCrestWraps } from "./tier7/ItemCrimsonCrestWraps";
import { itemEtherealEmbrace } from "./tier7/ItemEtherealEmbrace";
import { itemJadeclaspGloves } from "./tier8/ItemJadeclaspGloves";
import { itemOraclegripGloves } from "./tier9/ItemOraclegripGloves";
import { itemRunicRadianceGloves } from "./tier9/ItemRunicRadianceGloves";

export const glovesBlueprintIndex = {
  [GlovesBlueprint.LeatherGloves]: itemLeatherGloves,
  [GlovesBlueprint.StuddedGloves]: itemStuddedGloves,
  [GlovesBlueprint.ChainGloves]: itemChainGloves,
  [GlovesBlueprint.PlateGloves]: itemPlateGloves,
  [GlovesBlueprint.FrostwardenGloves]: itemFrostwardenGloves,
  [GlovesBlueprint.PyroclasmGloves]: itemPyroclasmGloves,
  [GlovesBlueprint.ShadowlordGloves]: itemShadowlordGloves,
  [GlovesBlueprint.OraclegripGloves]: itemOraclegripGloves,
  [GlovesBlueprint.GlovesOfGrace]: itemGlovesOfGrace,
  [GlovesBlueprint.EtherealEmbrace]: itemEtherealEmbrace,
  [GlovesBlueprint.GleamingGauntlets]: itemGleamingGauntlets,
  [GlovesBlueprint.RoyalDecreeGloves]: itemRoyalDecreeGloves,
  [GlovesBlueprint.OsirisGloves]: itemOsirisGloves,
  [GlovesBlueprint.CrimsonCrestWraps]: itemCrimsonCrestWraps,
  [GlovesBlueprint.RunicRadianceGloves]: itemRunicRadianceGloves,
  [GlovesBlueprint.JadeclaspGloves]: itemJadeclaspGloves,
  [GlovesBlueprint.GenesisGloves]: itemGenesisGloves,
};
