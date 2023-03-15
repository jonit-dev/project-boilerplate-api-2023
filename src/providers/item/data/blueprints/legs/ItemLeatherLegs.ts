import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLeatherLegs: IEquippableArmorBlueprint = {
  key: LegsBlueprint.LeatherLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/leather-legs.png",
  name: "Leather Legs",
  description: "A pair of simple leather legs.",
  defense: 4,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Legs],
  basePrice: 41,
};
