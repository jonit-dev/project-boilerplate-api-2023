import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBlueAuroraSpear } from "./ItemBlueAuroraSpear";
import { itemBohemianEarspoon } from "./ItemBohemianEarspoon";
import { itemCorseque } from "./ItemCorseque";
import { itemEarthbinderSpear } from "./ItemEarthbinderSpear";
import { itemGuanDao } from "./ItemGuanDao";
import { itemjavelin } from "./ItemJavelin";
import { itemMushroomSpear } from "./ItemMushroomSpear";
import { itemRoyalSpear } from "./ItemRoyalSpear";
import { itemSpear } from "./ItemSpear";
import { itemStoneSpear } from "./ItemStoneSpear";
import { itemTrident } from "./ItemTrident";
import { itemWhiteDragonSpear } from "./ItemWhiteDragonSpear";
import { itemCopperDoubleVoulge } from "./ItemCopperDoubleVoulge";
import { itemRustedDoubleVoulge } from "./ItemRustedDoubleVoulge";
import { itemPoseidonTrident } from "./ItemPoseidonTrident";

export const spearsBlueprintsIndex = {
  [SpearsBlueprint.RoyalSpear]: itemRoyalSpear,
  [SpearsBlueprint.Spear]: itemSpear,
  [SpearsBlueprint.StoneSpear]: itemStoneSpear,
  [SpearsBlueprint.BohemianEarspoon]: itemBohemianEarspoon,
  [SpearsBlueprint.Corseque]: itemCorseque,
  [SpearsBlueprint.GuanDao]: itemGuanDao,
  [SpearsBlueprint.Javelin]: itemjavelin,
  [SpearsBlueprint.Trident]: itemTrident,
  [SpearsBlueprint.BlueAuroraSpear]: itemBlueAuroraSpear,
  [SpearsBlueprint.EarthbinderSpear]: itemEarthbinderSpear,
  [SpearsBlueprint.MushroomSpear]: itemMushroomSpear,
  [SpearsBlueprint.WhiteDragonSpear]: itemWhiteDragonSpear,
  [SpearsBlueprint.CopperDoubleVoulge]: itemCopperDoubleVoulge,
  [SpearsBlueprint.RustedDoubleVoulge]: itemRustedDoubleVoulge,
  [SpearsBlueprint.PoseidonTrident]: itemPoseidonTrident,
};
