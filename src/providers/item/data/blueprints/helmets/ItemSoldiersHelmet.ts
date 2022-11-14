import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSoldiersHelmet: Partial<IItem> = {
  key: HelmetsBlueprint.SoldiersHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/soldiers-helmet.png",

  name: "Soldiers Helmet",
  description: "A helmet used by standard soldier.",
  defense: 7,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 53,
};
