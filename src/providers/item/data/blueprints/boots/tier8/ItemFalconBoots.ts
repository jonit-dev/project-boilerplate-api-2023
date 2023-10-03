import { IEquippableLightArmorTier8Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFalconBoots: IEquippableLightArmorTier8Blueprint = {
  key: BootsBlueprint.FalconBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/falcon-boots.png",
  name: "Falcon Boots",
  description: "Light as a feather, these boots promise swiftness in the skies and on land.",
  defense: 44,
  tier: 8,
  weight: 0.6,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 112,
};
