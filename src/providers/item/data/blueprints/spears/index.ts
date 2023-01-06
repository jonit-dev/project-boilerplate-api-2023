import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemBohemianEarspoon } from "./ItemBohemianEarspoon";
import { itemCorseque } from "./ItemCorseque";
import { itemGuanDao } from "./ItemGuanDao";
import { itemjavelin } from "./ItemJavelin";
import { itemRoyalSpear } from "./ItemRoyalSpear";
import { itemSpear } from "./ItemSpear";
import { itemStoneSpear } from "./ItemStoneSpear";
import { itemtrident } from "./ItemTrident";

export const spearsBlueprintsIndex = {
  [SpearsBlueprint.RoyalSpear]: itemRoyalSpear,
  [SpearsBlueprint.Spear]: itemSpear,
  [SpearsBlueprint.StoneSpear]: itemStoneSpear,
  [SpearsBlueprint.BohemianEarspoon]: itemBohemianEarspoon,
  [SpearsBlueprint.Corseque]: itemCorseque,
  [SpearsBlueprint.GuanDao]: itemGuanDao,
  [SpearsBlueprint.Javelin]: itemjavelin,
  [SpearsBlueprint.Trident]: itemtrident,
};
