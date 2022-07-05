import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemStuddedHelmet: Partial<IItem> = {
  key: "studded-helmet",
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/studded-helmet.png",
  textureKey: "studded-helmet",
  name: "Studded Helmet",
  description: "Common and practical, a studded is an adequate protection against battlefield conditions.",
  defense: 4,
  weight: 0.6,
  allowedEquipSlotType: [ItemSlotType.Head],
};