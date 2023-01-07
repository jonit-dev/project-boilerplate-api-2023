import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRubyRing: Partial<IItem> = {
  key: AccessoriesBlueprint.RubyRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/ruby-ring.png",
  name: "Ruby Ring",
  description: "A stunning ruby ring, crafted by a talented dwarf artisan.",
  attack: 5,
  defense: 3,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 45,
};
