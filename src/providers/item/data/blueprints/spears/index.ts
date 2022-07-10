import { SpearsBlueprint } from "../../types/blueprintTypes";
import { itemRoyalSpear } from "./ItemRoyalSpear";
import { itemSpear } from "./ItemSpear";

export const spearsBlueprintsIndex = {
  [SpearsBlueprint.RoyalSpear]: itemRoyalSpear,
  [SpearsBlueprint.Spear]: itemSpear,
};
