import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHasteRing: Partial<IItem> = {
  key: AccessoriesBlueprint.HasteRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/haste-ring.png",
  name: "Haste Ring",
  description:
    "A magical ring that imbues its wearer with the power of speed and quickness. It is said to grant the ability to move and react with lightning-fast reflexes.",
  attack: 6,
  defense: 3,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 45,
};
