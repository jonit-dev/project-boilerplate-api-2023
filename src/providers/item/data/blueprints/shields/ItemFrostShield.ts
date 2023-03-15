import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFrostShield: IEquippableArmorBlueprint = {
  key: ShieldsBlueprint.FrostShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/frost-shield.png",
  name: "Frost Shield",
  description: "A defensive tool based on a magic durable ice",
  defense: 10,
  weight: 1.9,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 53,
};
