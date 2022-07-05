import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemBoots: Partial<IItem> = {
  key: "boots",
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/boots.png",
  textureKey: "boots",
  name: "Boots",
  description: "A simple leather boots.",
  defense: 2,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Feet],
};