import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemRoyalSpear } from "./ItemRoyalSpear";
import { itemSpear } from "./ItemSpear";
import { itemStoneSpear } from "./ItemStoneSpear";

export const spearsBlueprintsIndex = {
  [SpearsBlueprint.RoyalSpear]: itemRoyalSpear,
  [SpearsBlueprint.Spear]: itemSpear,
  [SpearsBlueprint.StoneSpear]: itemStoneSpear,
};
