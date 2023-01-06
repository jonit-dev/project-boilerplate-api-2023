import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemOrcRing: Partial<IItem> = {
  key: AccessoriesBlueprint.OrcRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/orc-ring.png",
  name: "Orc Ring",
  description: "a golden ring crafted by a orc master craftsman",
  attack: 1,
  defense: 1,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 30,
};
