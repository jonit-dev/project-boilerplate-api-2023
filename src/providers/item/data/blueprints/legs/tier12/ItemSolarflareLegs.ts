import { IEquippableLightArmorTier12Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSolarflareLegs: IEquippableLightArmorTier12Blueprint = {
  key: LegsBlueprint.SolarflareLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/solarflare-legs.png",
  name: "Solarflare Legs",
  description: "Radiating the power of the sun, they offer warmth and light in the darkest of battles.",
  weight: 0.4,
  defense: 65,
  tier: 12,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
