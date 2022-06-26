import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemLeatherJacket: Partial<IItem> = {
  key: "leather-jacket",
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/leather-jacket.png",
  textureKey: "leather-jacket",
  name: "Leather Jacket",
  description: "A jacket made of treated leather.",
  defense: 5,
  weight: 0.8,
  allowedEquipSlotType: [ItemSlotType.Torso],
};
