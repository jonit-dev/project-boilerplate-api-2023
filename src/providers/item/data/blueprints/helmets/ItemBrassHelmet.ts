import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBrassHelmet: Partial<IItem> = {
  key: HelmetBlueprint.BrassHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/brass-helmet.png",
  textureKey: "brass-helmet",
  name: "Brass Helmet",
  description: "A brass helmet.",
  defense: 5,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Head],
};
