import { OthersBlueprint } from "../../types/itemsBlueprintTypes";
import { itemCandle } from "./ItemCandle";
import { itemRoyalChalice } from "./ItemRoyalChalice";

export const othersBlueprintIndex = {
  [OthersBlueprint.Candle]: itemCandle,
  [OthersBlueprint.RoyalChalice]: itemRoyalChalice,
};
