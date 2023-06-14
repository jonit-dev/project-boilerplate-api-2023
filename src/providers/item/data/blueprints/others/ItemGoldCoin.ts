import { IBaseItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { OthersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGoldCoin: IBaseItemBlueprint = {
  key: OthersBlueprint.GoldCoin,
  type: ItemType.Other,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "others/gold-coin.png",
  name: "Gold Coin",
  description: "A pile of gold coins.",
  weight: 0.01,
  maxStackSize: 9999,
};
