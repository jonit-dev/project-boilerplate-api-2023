import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemScutumShield: IEquippableArmorTier3Blueprint = {
  key: ShieldsBlueprint.ScutumShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/scutum-shield.png",
  name: "Scutum Shield",
  description: "The Scutum Shield was used by the ancient roman armies. You could build a house from these.",
  defense: 24,
  tier: 3,
  weight: 2.4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 65,
};
