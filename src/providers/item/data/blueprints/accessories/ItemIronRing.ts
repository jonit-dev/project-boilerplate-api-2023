import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronRing: Partial<IItem> = {
  key: AccessoriesBlueprint.IronRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/iron-ring.png",
  name: "Iron Ring",
  description: "a iron ring crafted by a dwarf master craftsman.",
  attack: 1,
  defense: 1,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 10,
};
