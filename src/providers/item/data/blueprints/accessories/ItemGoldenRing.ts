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
  description:
    "A luxurious and ornate ring made of pure gold. It is a symbol of wealth and status, and is often given as a gift to show appreciation or affection.",
  attack: 5,
  defense: 3,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 40,
};
