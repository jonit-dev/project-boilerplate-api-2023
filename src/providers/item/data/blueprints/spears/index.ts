import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemRoyalSpear } from "./ItemRoyalSpear";
import { itemSpear } from "./ItemSpear";

export const spearsBlueprintsIndex = {
  [SpearsBlueprint.RoyalSpear]: itemRoyalSpear,
  [SpearsBlueprint.Spear]: itemSpear,
};
