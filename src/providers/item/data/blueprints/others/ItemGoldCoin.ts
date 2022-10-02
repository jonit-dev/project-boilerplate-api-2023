import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { OthersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGoldCoin: Partial<IItem> = {
  key: OthersBlueprint.GoldCoin,
  type: ItemType.Other,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "others/gold-coin.png",
  textureKey: "gold-coin",
  name: "Gold Coin",
  description: "A pile of gold coins.",
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Ring],
};
