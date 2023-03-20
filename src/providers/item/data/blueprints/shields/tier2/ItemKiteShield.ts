import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemKiteShield: IEquippableArmorTier2Blueprint = {
  key: ShieldsBlueprint.KiteShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/kite-shield.png",
  name: "Kite Shield",
  description: "A shield with a large surface area that provides high defense against ranged attacks.",
  defense: 18,
  tier: 2,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 45,
};
