import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemElvenRing: Partial<IItem> = {
  key: AccessoriesBlueprint.ElvenRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/elven-ring.png",
  textureKey: "rings",
  name: "Elven Ring",
  description: "a golden ring crafted by an elven master craftsman.",
  attack: 1,
  defense: 1,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
};
