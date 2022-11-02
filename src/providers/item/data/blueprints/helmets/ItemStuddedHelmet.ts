import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemStuddedHelmet: Partial<IItem> = {
  key: HelmetsBlueprint.StuddedHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/studded-helmet.png",

  name: "Studded Helmet",
  description: "Common and practical, a studded is an adequate protection against battlefield conditions.",
  defense: 4,
  weight: 0.6,
  allowedEquipSlotType: [ItemSlotType.Head],
  sellPrice: 20,
};
