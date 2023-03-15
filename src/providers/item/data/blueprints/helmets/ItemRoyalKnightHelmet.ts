import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalKnightHelmet: IEquippableArmorBlueprint = {
  key: HelmetsBlueprint.RoyalKnightHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/royal-knight-helmet.png",
  name: "Royal Knight Helmet",
  description: "The Royal Knight Helmet have a red plumage on top and covers entire head with slits for eyes.",
  defense: 15,
  weight: 2.4,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 85,
};
