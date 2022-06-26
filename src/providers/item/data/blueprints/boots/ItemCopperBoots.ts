import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemCopperBoots: Partial<IItem> = {
  key: "copper-boots",
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/copper-boots.png",
  textureKey: "copper-boots",
  name: "Copper Boots",
  description: "A boots plated with cooper.",
  defense: 4,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Feet],
};
