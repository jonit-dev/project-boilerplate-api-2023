import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemBag: Partial<IItem> = {
  key: "bag",
  type: ItemType.Container,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "containers/bag.png",
  textureKey: "bag",
  name: "Bag",
  description: "You see a bag. It has made using leather and it has 10 total slots.",
  weight: 1.5,
  isItemContainer: true,
  generateContainerSlots: 10,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};