import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemSpear } from "./tier0/ItemSpear";
import { itemStoneSpear } from "./tier0/ItemStoneSpear";
import { itemjavelin } from "./tier1/ItemJavelin";
import { itemBohemianEarspoon } from "./tier2/ItemBohemianEarspoon";
import { itemCopperDoubleVoulge } from "./tier2/ItemCopperDoubleVoulge";
import { itemCorseque } from "./tier2/ItemCorseque";
import { itemTrident } from "./tier2/ItemTrident";
import { itemBlueAuroraSpear } from "./tier3/ItemBlueAuroraSpear";
import { itemGuanDao } from "./tier3/ItemGuanDao";
import { itemMushroomSpear } from "./tier3/ItemMushroomSpear";
import { itemEarthbinderSpear } from "./tier4/ItemEarthbinderSpear";
import { itemPoseidonTrident } from "./tier4/ItemPoseidonTrident";
import { itemRoyalSpear } from "./tier5/ItemRoyalSpear";
import { itemRustedDoubleVoulge } from "./tier5/ItemRustedDoubleVoulge";
import { itemWhiteDragonSpear } from "./tier5/ItemWhiteDragonSpear";

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
