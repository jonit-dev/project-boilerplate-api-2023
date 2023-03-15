import { IEquippableItemBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCorruptionNecklace: IEquippableItemBlueprint = {
  key: AccessoriesBlueprint.CorruptionNecklace,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/corruption-necklace.png",
  name: "Corruption Necklace",
  description: "a neckclace tainted by corrupted energy.",
  attack: 1,
  defense: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 26,
};
