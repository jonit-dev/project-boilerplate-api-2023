import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemLeatherLegs: Partial<IItem> = {
  key: "leather-legs",
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/leather-legs.png",
  textureKey: "leather-legs",
  name: "leather-legs",
  description: "A pair of simple leather legs.",
  defense: 4,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
