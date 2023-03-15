import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDarkShield: IEquippableArmorBlueprint = {
  key: ShieldsBlueprint.DarkShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/dark-shield.png",
  name: "Dark Shield",
  description: "A shield imbued with dark magic of shadowlands.",
  defense: 25,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 65,
};
