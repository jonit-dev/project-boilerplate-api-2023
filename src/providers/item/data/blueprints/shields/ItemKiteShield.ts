import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemKiteShield: IEquippableArmorBlueprint = {
  key: ShieldsBlueprint.KiteShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/kite-shield.png",
  name: "Kite Shield",
  description: "A shield with a large surface area that provides high defense against ranged attacks.",
  defense: 14,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 45,
};
