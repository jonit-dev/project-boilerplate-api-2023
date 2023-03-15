import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHolyShield: IEquippableArmorBlueprint = {
  key: ShieldsBlueprint.HolyShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/holy-shield.png",
  name: "Holy Shield",
  description: "A shield blessed with holy magic that provides high resistance against dark and undead attacks.",
  defense: 22,
  weight: 1.8,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 56,
};
