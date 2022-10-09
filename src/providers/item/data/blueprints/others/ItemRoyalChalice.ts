import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { OthersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalChalice: Partial<IItem> = {
  key: OthersBlueprint.RoyalChalice,
  type: ItemType.Other,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "others/royal-chalice.png",
  textureKey: "royal-chalice",
  name: "Royal Chalice",
  description: "A well master crafted chalice worth of a king.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Ring],
};
