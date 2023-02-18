import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemMithrilLegs: Partial<IItem> = {
  key: LegsBlueprint.MithrilLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/mithril-legs.png",
  name: "Mithril Leg",
  description: "A leg armor made of a rare, incredibly strong metal known as mithril",
  weight: 1,
  defense: 12,
  allowedEquipSlotType: [ItemSlotType.Legs],
  basePrice: 54,
};
