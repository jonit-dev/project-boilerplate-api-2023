import { IEquippableAccessoryTier0Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { AccessoriesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemCorruptionNecklace: IEquippableAccessoryTier0Blueprint = {
  key: AccessoriesBlueprint.CorruptionNecklace,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/corruption-necklace.png",
  name: "Corruption Necklace",
  description: "a neckclace tainted by corrupted energy.",
  attack: 1,
  defense: 0,
  tier: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 26,
};
