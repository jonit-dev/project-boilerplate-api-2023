import { IEquippableLightArmorTier2Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBronzeBoots: IEquippableLightArmorTier2Blueprint = {
  key: BootsBlueprint.BronzeBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/bronze-boots.png",
  name: "Bronze Boots",
  description: "Forged from ancient metal, these boots provide rudimentary protection.",
  defense: 8,
  tier: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 62,
};
