import { IEquippableLightArmorTier2Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSteelBoots: IEquippableLightArmorTier2Blueprint = {
  key: BootsBlueprint.SteelBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/steel-boots.png",
  name: "Steel Boots",
  description: "Cold, hard defense – a bastion against the harshest of blows.",
  defense: 9,
  tier: 2,
  weight: 0.8,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 62,
};
