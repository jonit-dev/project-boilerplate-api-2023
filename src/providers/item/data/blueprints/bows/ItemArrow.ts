import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemArrow: Partial<IItem> = {
  key: "arrow",
  type: ItemType.Weapon,
  subType: ItemSubType.Bow,
  textureAtlas: "items",
  texturePath: "bows/arrow.png",
  textureKey: "arrow",
  name: "Arrow",
  description: "An iron head arrow.",
  attack: 1,
  weight: 0.01,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
