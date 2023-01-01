import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBandana: Partial<IItem> = {
  key: AccessoriesBlueprint.Bandana,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/bandana.png",
  name: "Bandana",
  description: "a simple cloth bandana.",
  defense: 0.5,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 1,
};
