import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableAccessoryTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGoldenRing: IEquippableAccessoryTier2Blueprint = {
  key: AccessoriesBlueprint.GoldenRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/golden-ring.png",
  name: "Golden Ring",
  description:
    "A luxurious and ornate ring made of pure gold. It is a symbol of wealth and status, and is often given as a gift to show appreciation or affection.",
  attack: 8,
  defense: 6,
  tier: 2,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 40,
};
