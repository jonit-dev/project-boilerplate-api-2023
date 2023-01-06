import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSapphireRing: Partial<IItem> = {
  key: AccessoriesBlueprint.SapphireRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/sapphire-ring.png",
  name: "Sapphire Ring",
  description: "a sapphire ring crafted by a dwarf master craftsman",
  attack: 2,
  defense: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 50,
};
