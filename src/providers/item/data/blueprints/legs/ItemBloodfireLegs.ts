import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBloodfireLegs: Partial<IItem> = {
  key: LegsBlueprint.BloodfireLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/bloodfire-legs.png",
  name: "Bloodfire Legs",
  description:
    "The Bloodfire Legs are a fearsome set of leg armor that is said to have been forged in the fiery depths of the underworld. Made from dark, shimmering metals that resemble obsidian or volcanic rock, they are adorned with intricate designs that evoke the image of molten lava and flames.",
  weight: 1,
  defense: 18,
};