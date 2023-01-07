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
  description: "A precious jade ring, believed to be crafted by the gods themselves.",
  attack: 7,
  defense: 7,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 60,
};
