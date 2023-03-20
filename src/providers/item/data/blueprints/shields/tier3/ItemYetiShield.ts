import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemYetiShield: IEquippableArmorTier3Blueprint = {
  key: ShieldsBlueprint.YetiShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/yeti-shield.png",
  name: "Yeti's Shield",
  description: "A rare shield used by Yetis, against the frost island invaders.",
  defense: 29,
  tier: 3,
  weight: 1.8,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 57,
};