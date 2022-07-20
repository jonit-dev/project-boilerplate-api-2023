import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemIronArmor: Partial<IItem> = {
  key: "iron-armor",
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/iron-armor.png",
  textureKey: "armors",
  name: "Iron Armor",
  description: "An iron plated armor.",
  defense: 24,
  weight: 6,
  allowedEquipSlotType: [ItemSlotType.Torso],
};
