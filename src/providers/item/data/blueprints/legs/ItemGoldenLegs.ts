import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGoldenLegs: IEquippableArmorBlueprint = {
  key: LegsBlueprint.GoldenLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/golden-legs.png",
  name: "Golden Legs",
  description: "A Leg armor made of gold.",
  weight: 2,
  defense: 30,
  allowedEquipSlotType: [ItemSlotType.Legs],
  basePrice: 5000,
};
