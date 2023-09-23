import { IEquippableAccessoryTier17Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEmeraldEleganceNecklace: IEquippableAccessoryTier17Blueprint = {
  key: AccessoriesBlueprint.EmeraldEleganceNecklace,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/emerald-elegance-necklace.png",
  name: "Emerald Elegance Necklace",
  description: "A necklace adorned with gleaming green emeralds, representing natures beauty.",
  attack: 52,
  defense: 54,
  tier: 17,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 30000,
};
