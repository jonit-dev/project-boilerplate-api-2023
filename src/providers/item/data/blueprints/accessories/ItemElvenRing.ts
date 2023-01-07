import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemElvenRing: Partial<IItem> = {
  key: AccessoriesBlueprint.ElvenRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/elven-ring.png",
  name: "Elven Ring",
  description:
    "A delicate and intricate ring crafted by the skilled hands of elven artisans. It is imbued with the magic and grace of the elven people.",
  attack: 4,
  defense: 2,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 35,
};
