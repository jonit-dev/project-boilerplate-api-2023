import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalHelmet: IEquippableArmorBlueprint = {
  key: HelmetsBlueprint.RoyalHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/royal-helmet.png",
  name: "Royal Helmet",
  description: "The Royal Helmet are made with fine and high quality materials.",
  defense: 13,
  weight: 1.7,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 77,
};
