import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFrostShield: IEquippableArmorTier2Blueprint = {
  key: ShieldsBlueprint.FrostShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/frost-shield.png",
  name: "Frost Shield",
  description: "A defensive tool based on a magic durable ice",
  defense: 22,
  tier: 2,
  weight: 1.9,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 53,
};
