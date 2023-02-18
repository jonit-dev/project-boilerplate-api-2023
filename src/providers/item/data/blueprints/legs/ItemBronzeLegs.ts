import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBronzeLegs: Partial<IItem> = {
  key: LegsBlueprint.BronzeLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/bronze-legs.png",
  name: "Bronze Legs",
  description: "A Leg armor made of bronze.",
  weight: 1.8,
  defense: 8,
  allowedEquipSlotType: [ItemSlotType.Legs],
  basePrice: 40,
};
