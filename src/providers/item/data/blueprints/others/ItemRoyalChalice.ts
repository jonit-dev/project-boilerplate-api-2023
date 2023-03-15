import { IBaseItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { OthersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalChalice: IBaseItemBlueprint = {
  key: OthersBlueprint.RoyalChalice,
  type: ItemType.Other,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "others/royal-chalice.png",
  name: "Royal Chalice",
  description: "A well master crafted chalice worth of a king.",
  weight: 0.8,
  basePrice: 1,
};
