import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier4Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemKnightsShield: IEquippableArmorTier4Blueprint = {
  key: ShieldsBlueprint.KnightsShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/knights-shield.png",
  name: "Knights Shield",
  description: "A well made shield used by the knights of the realm.",
  defense: 30,
  tier: 4,
  weight: 2.1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 60,
};
