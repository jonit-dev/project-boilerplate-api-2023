import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWoodenShield: IEquippableArmorTier0Blueprint = {
  key: ShieldsBlueprint.WoodenShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/wooden-shield.png",
  name: "Training Shield",
  description: "A simple round wooden shield for protection.",
  defense: 1,
  tier: 0,
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 37,
  isTraining: true,
};
