import { IEquippableAccessoryTier13Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBloodstoneAmulet: IEquippableAccessoryTier13Blueprint = {
  key: AccessoriesBlueprint.BloodstoneAmulet,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/bloodstone-amulet.png",
  name: "Bloodstone Amulet",
  description: "This amulet, with a blood-red gemstone, grants its user enhanced physical strength.",
  attack: 40,
  defense: 42,
  tier: 13,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 20000,
};
