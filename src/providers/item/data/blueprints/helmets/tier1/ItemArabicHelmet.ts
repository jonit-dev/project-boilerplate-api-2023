import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemArabicHelmet: IEquippableArmorTier0Blueprint = {
  key: HelmetsBlueprint.ArabicHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/arabic-helmet.png",
  name: "Arabic Helmet",
  description: "The Arabic Helmet a rounded format and has a guard around the eyes and mouth.",
  defense: 5,
  tier: 0,
  weight: 0.8,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 37,
};
