import { IEquippableLightArmorTier11Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSolarflareBoots: IEquippableLightArmorTier11Blueprint = {
  key: BootsBlueprint.SolarflareBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/solarflare-boots.png",
  name: "Solarflare Boots",
  description: "Illuminated by the sun, they blaze a trail of radiant energy.",
  defense: 60,
  tier: 11,
  weight: 0.4,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 128,
};
