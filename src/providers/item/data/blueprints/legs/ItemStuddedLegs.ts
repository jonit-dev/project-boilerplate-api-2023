import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemStuddedLegs: Partial<IItem> = {
  key: LegsBlueprint.StuddedLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/studded-legs.png",
  textureKey: "studded-legs",
  name: "Studded Legs",
  description: "A pair of simple studded legs.",
  defense: 6,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
