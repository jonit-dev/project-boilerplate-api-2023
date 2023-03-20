import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier4Blueprint } from "../../../types/TierBlueprintTypes";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGoldenLegs: IEquippableLightArmorTier4Blueprint = {
  key: LegsBlueprint.GoldenLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/golden-legs.png",
  name: "Golden Legs",
  description: "A Leg armor made of gold.",
  weight: 2,
  defense: 22,
  tier: 4,
  allowedEquipSlotType: [ItemSlotType.Legs],
  basePrice: 5000,
};
