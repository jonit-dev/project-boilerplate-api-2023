import { IEquippableAccessoryTier15Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemForestHeartPendant: IEquippableAccessoryTier15Blueprint = {
  key: AccessoriesBlueprint.ForestHeartPendant,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/forest-heart-pendant.png",
  name: "Forest Heart Pendant",
  description: "This green pendant carries the heart and soul of an ancient forest within.",
  attack: 46,
  defense: 48,
  tier: 15,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 25000,
};
