import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier6Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGleamingGauntlets: IEquippableLightArmorTier6Blueprint = {
  key: GlovesBlueprint.GleamingGauntlets,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/gleaming-gauntlets.png",
  name: "Gleaming Gauntlets",
  description: "Polished to perfection, they are favorites among high-ranking officials.",
  defense: 33,
  tier: 6,
  weight: 1.3,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 97,
};
