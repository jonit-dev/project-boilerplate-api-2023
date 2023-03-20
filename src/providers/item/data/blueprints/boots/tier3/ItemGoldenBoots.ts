import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGoldenBoots: IEquippableLightArmorTier3Blueprint = {
  key: BootsBlueprint.GoldenBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/golden-boots.png",
  name: "Golden Boots",
  description: "An boot made of gold. It is a part of the Golden set.",
  defense: 16,
  tier: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 89,
};
