import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemKnightsShield: IEquippableArmorBlueprint = {
  key: ShieldsBlueprint.KnightsShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/knights-shield.png",
  name: "Knights Shield",
  description: "A well made shield used by the knights of the realm.",
  defense: 17,
  weight: 2.1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 60,
};
