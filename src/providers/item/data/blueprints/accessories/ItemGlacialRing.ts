import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGlacialRing: Partial<IItem> = {
  key: AccessoriesBlueprint.GlacialRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/glacial-ring.png",
  name: "Glacial Ring",
  description:
    "The Glacial Ring is a unique and powerful piece of jewelry that is said to have been crafted from the frozen glaciers of the far north.",
  weight: 1,
  attack: 6,
  defense: 4,
  allowedEquipSlotType: [ItemSlotType.Ring],
};