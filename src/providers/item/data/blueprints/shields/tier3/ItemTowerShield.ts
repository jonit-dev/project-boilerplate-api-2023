import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemTowerShield: IEquippableArmorTier3Blueprint = {
  key: ShieldsBlueprint.TowerShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/tower-shield.png",
  name: "Tower Shield",
  description: "A massive shield that provides excellent defense but significantly limits mobility.",
  defense: 23,
  tier: 3,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 58,
};
