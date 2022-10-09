import { OthersBlueprint } from "../../types/itemsBlueprintTypes";
import { itemCandle } from "./ItemCandle";
import { itemGoldCoin } from "./ItemGoldCoin";
import { itemRoyalChalice } from "./ItemRoyalChalice";

export const othersBlueprintIndex = {
  [OthersBlueprint.Candle]: itemCandle,
  [OthersBlueprint.RoyalChalice]: itemRoyalChalice,
  [OthersBlueprint.GoldCoin]: itemGoldCoin,
};
