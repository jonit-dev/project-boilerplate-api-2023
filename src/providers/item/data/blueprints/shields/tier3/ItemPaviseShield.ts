import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPaviseShield: IEquippableArmorTier3Blueprint = {
  key: ShieldsBlueprint.PaviseShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/pavise-shield.png",
  name: "Pavise Shield",
  description: "A heavy shield that provides excellent defense.",
  defense: 24,
  tier: 3,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 54,
};
