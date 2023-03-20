import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHeaterShield: IEquippableArmorTier1Blueprint = {
  key: ShieldsBlueprint.HeaterShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/heater-shield.png",
  name: "Heater Shield",
  description: "A lightweight shield that provides good protection and allows for quick movement.",
  defense: 10,
  tier: 1,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 52,
};
