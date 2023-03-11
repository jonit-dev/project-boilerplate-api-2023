import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGlacialLegs: Partial<IItem> = {
  key: LegsBlueprint.GlacialLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/glacial-legs.png",
  name: "Glacial Legs",
  description:
    "The Glacial Legs are a set of formidable leg armor that is said to have been forged from the icy glaciers of the far north",
  weight: 1,
  defense: 17,
};
