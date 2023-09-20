import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier7Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCrimsonCrestWraps: IEquippableLightArmorTier7Blueprint = {
  key: GlovesBlueprint.CrimsonCrestWraps,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/crimson-crest-wraps.png",
  name: "Crimson Crest Wraps",
  description: "Worn by elite guards, their hue represents their unwavering loyalty.",
  defense: 37,
  tier: 7,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 97,
};
