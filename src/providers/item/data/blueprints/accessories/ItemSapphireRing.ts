import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSapphireRing: Partial<IItem> = {
  key: AccessoriesBlueprint.SapphireRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/sapphire-ring.png",
  name: "Sapphire Ring",
  description:
    "A beautiful and radiant ring set with a sparkling sapphire, a deep blue gemstone prized for its radiance and clarity. It is a symbol of wisdom and serenity,",
  attack: 6,
  defense: 4,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 55,
};
