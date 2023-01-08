import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ContainersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBackpack: Partial<IItem> = {
  key: ContainersBlueprint.Backpack,
  type: ItemType.Container,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "containers/backpack.png",

  name: "Backpack",
  description: "You see a backpack. It has made using leather and it has a total of 40 slots.",
  weight: 3,
  isItemContainer: true,
  generateContainerSlots: 40,
  allowedEquipSlotType: [ItemSlotType.Inventory],
};
