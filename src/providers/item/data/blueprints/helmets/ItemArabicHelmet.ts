import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemArabicHelmet: IEquippableArmorBlueprint = {
  key: HelmetsBlueprint.ArabicHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/arabic-helmet.png",
  name: "Arabic Helmet",
  description: "The Arabic Helmet a rounded format and has a guard around the eyes and mouth.",
  defense: 3,
  weight: 0.8,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 37,
};
