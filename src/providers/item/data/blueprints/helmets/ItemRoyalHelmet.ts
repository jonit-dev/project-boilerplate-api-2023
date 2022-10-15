import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalHelmet: Partial<IItem> = {
  key: HelmetsBlueprint.RoyalHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/royal-helmet.png",
  textureKey: "royal-helmet",
  name: "Royal Helmet",
  description: "The Royal Helmet are made with fine and high quality materials.",
  defense: 13,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.Head],
};
