import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBrassHelmet: Partial<IItem> = {
  key: HelmetsBlueprint.BrassHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/brass-helmet.png",
  name: "Brass Helmet",
  description: "A brass helmet.",
  defense: 5,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 45,
};
