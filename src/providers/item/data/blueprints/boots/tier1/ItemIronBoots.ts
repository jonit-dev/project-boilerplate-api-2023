import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemIronBoots: IEquippableLightArmorTier1Blueprint = {
  key: BootsBlueprint.IronBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/iron-boots.png",
  name: "Iron Boots",
  description: "An iron plated boot.",
  defense: 6,
  tier: 1,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 45,
};
