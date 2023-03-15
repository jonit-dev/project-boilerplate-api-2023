import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemEnergyShield: IEquippableArmorBlueprint = {
  key: ShieldsBlueprint.EnergyShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/energy-shield.png",
  name: "Energy Shield",
  description: "A shield that absorbs and stores magical energy  which can be released in a powerful burst.",
  defense: 18,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 85,
};
