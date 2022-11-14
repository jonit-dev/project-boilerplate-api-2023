import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDeathNecklace: Partial<IItem> = {
  key: AccessoriesBlueprint.DeathNecklace,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/death-necklace.png",
  name: "Death Necklace",
  description: "a dark necklace imbued with the energy of the dead.",
  attack: 2,
  defense: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 27,
};
