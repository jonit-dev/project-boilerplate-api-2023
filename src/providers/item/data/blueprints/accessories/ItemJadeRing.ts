import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemJadeRing: Partial<IItem> = {
  key: AccessoriesBlueprint.JadeRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/jade-ring.png",
  name: "Jade Ring",
  description: "a golden ring crafted by gods.",
  attack: 5,
  defense: 5,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 50,
};
