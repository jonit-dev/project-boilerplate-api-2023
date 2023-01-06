import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGoldenRing: Partial<IItem> = {
  key: AccessoriesBlueprint.GoldenRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/golden-ring.png",
  name: "Golden Ring",
  description: "a golden ring crafted by a master craftsman.",
  attack: 1,
  defense: 2,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 40,
};
