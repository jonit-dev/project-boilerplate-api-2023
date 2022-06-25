import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemSandals: Partial<IItem> = {
  key: "sandals",
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/sandals.png",
  textureKey: "sandals",
  name: "Sandals",
  description: "A simple sandals.",
  defense: 1,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Feet],
};
