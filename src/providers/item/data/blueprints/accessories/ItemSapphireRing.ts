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
  description: "A sparkling sapphire ring, crafted by a talented dwarf artisan.",
  attack: 6,
  defense: 4,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 55,
};
