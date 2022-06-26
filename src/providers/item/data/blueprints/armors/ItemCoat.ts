import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemCoat: Partial<IItem> = {
  key: "coat",
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/coat.png",
  textureKey: "coat",
  name: "Coat",
  description: "A heavy pelt coat to warm you.",
  defense: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Torso],
};
