import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier4Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHolyShield: IEquippableArmorTier4Blueprint = {
  key: ShieldsBlueprint.HolyShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/holy-shield.png",
  name: "Holy Shield",
  description: "A shield blessed with holy magic that provides high resistance against dark and undead attacks.",
  defense: 33,
  tier: 4,
  weight: 1.8,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 56,
};
