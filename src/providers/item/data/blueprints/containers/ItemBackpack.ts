import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemBackpack: Partial<IItem> = {
  key: "backpack",
  type: ItemType.Container,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "containers/backpack.png",
  textureKey: "backpack",
  name: "Backpack",
  description: "You see a backpack. It has made using leather and it has 20 total slots.",
  weight: 3,
  isItemContainer: true,
  generateContainerSlots: 20,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
