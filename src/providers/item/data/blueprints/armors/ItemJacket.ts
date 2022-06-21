import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemJacket: Partial<IItem> = {
  key: "jacket",
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/jacket.png",
  textureKey: "jacket",
  name: "Jacket",
  description: "You see a jacket.",
  defense: 2,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.Torso],
};
