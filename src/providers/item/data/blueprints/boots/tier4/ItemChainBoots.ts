import { IEquippableLightArmorTier4Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemChainBoots: IEquippableLightArmorTier4Blueprint = {
  key: BootsBlueprint.ChainBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/chain-boots.png",
  name: "Chain Boots",
  description: "Interlocked rings offer flexible defense with every step.",
  defense: 20,
  tier: 4,
  weight: 0.6,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 92,
};
