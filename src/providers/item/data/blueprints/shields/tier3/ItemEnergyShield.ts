import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEnergyShield: IEquippableArmorTier3Blueprint = {
  key: ShieldsBlueprint.EnergyShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/energy-shield.png",
  name: "Energy Shield",
  description: "A shield that absorbs and stores magical energy  which can be released in a powerful burst.",
  defense: 24,
  tier: 3,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 85,
};
