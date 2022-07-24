import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSoldiersHelmet: Partial<IItem> = {
  key: HelmetBlueprint.SoldiersHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/soldiers-helmet.png",
  textureKey: "soldiers-helmet",
  name: "Soldiers Helmet",
  description: "A helmet used by standard soldier.",
  defense: 7,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Head],
};
