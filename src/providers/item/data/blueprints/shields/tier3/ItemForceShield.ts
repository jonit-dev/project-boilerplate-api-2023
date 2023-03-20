import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemForceShield: IEquippableArmorTier3Blueprint = {
  key: ShieldsBlueprint.ForceShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/force-shield.png",
  name: "Force Shield",
  description:
    "A shield that generates a protective force field around the wielder increasing defense against physical attacks.",
  defense: 27,
  tier: 3,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 95,
};
