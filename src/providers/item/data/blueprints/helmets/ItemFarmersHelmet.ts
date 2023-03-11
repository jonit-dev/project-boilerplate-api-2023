import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFarmersHelmet: Partial<IItem> = {
  key: HelmetsBlueprint.FarmersHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/farmer-helmet.png",
  name: "Farmers Helmet",
  description: "A Simple farmer helmet made with cotton.",
  defense: 2,
  weight: 0.3,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 33,
};
