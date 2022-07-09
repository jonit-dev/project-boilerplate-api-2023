import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemStuddedLegs: Partial<IItem> = {
  key: "studded-legs",
  type: ItemType.Armor,
  subType: ItemSubType.Leg,
  textureAtlas: "items",
  texturePath: "legs/studded-legs.png",
  textureKey: "studded-legs",
  name: "studded-legs",
  description: "A pair of simple studded legs.",
  defense: 6,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
