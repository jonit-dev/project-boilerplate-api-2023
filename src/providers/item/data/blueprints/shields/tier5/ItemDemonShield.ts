import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier5Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDemonShield: IEquippableArmorTier5Blueprint = {
  key: ShieldsBlueprint.DemonShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/demon-shield.png",
  name: "Demon Shield",
  description: "A shield made from the scales of an ancient demon.",
  defense: 43,
  tier: 5,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 75,
};
