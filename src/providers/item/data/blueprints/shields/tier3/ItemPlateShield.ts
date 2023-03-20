import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPlateShield: IEquippableArmorTier3Blueprint = {
  key: ShieldsBlueprint.PlateShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/plate-shield.png",
  name: "Plate Shield",
  description: "A large metal shield.",
  defense: 23,
  tier: 3,
  weight: 2.3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 77,
};
