import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier4Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDarkShield: IEquippableArmorTier4Blueprint = {
  key: ShieldsBlueprint.DarkShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/dark-shield.png",
  name: "Dark Shield",
  description: "A shield imbued with dark magic of shadowlands.",
  defense: 33,
  tier: 4,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 65,
};
