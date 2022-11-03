import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemInfantryHelmet: Partial<IItem> = {
  key: HelmetsBlueprint.InfantryHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/infantry-helmet.png",

  name: "Infantry Helmet",
  description:
    "The helmet has movable cheek-guards on each side and a butted chainmail avantail to protect the backside of the neck.",
  defense: 7,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Head],
  sellPrice: 25,
};
