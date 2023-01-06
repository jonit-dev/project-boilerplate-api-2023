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
  description: "a ruby ring crafted by a dwarf master craftsman",
  attack: 2,
  defense: 2,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 40,
};
