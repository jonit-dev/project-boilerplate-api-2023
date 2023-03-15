import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBronzeLegs: IEquippableArmorBlueprint = {
  key: LegsBlueprint.BronzeLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/bronze-legs.png",
  name: "Bronze Legs",
  description: "A Leg armor made of bronze.",
  weight: 1.8,
  defense: 12,
  allowedEquipSlotType: [ItemSlotType.Legs],
  basePrice: 300,
};
