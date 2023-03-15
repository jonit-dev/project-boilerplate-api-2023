import { IBaseItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { OthersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemMap: IBaseItemBlueprint = {
  key: OthersBlueprint.Map,
  type: ItemType.Other,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "others/map.png",
  name: "Map",
  description: "A map with instructions.",
  weight: 0.5,
};
