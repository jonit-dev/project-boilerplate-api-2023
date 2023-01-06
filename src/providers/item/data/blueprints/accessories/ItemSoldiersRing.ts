import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSoldiersRing: Partial<IItem> = {
  key: AccessoriesBlueprint.SoldiersRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/soldiers-ring.png",
  name: "Soldiers Ring",
  description: "a iron ring crafted by a dwarf master craftsman",
  attack: 1,
  defense: 2,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 15,
};
