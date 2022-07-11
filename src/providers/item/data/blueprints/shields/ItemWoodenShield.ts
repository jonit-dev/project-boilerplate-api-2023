import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemWoodenShield: Partial<IItem> = {
  key: "wooden-shield",
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/wooden-shield.png",
  textureKey: "wooden-shield",
  name: "wooden-shield",
  description: "A simple round wooden shield for protection.",
  defense: 3,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
