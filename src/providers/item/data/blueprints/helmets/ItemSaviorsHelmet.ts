import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSaviorsHelmet: Partial<IItem> = {
  key: HelmetsBlueprint.SaviorsHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/saviors-helmet.png",
  name: "Saviors Helmet",
  description: "The Salviors Helmet are made of tin and decorated with eagle feathers nas laterais.",
  defense: 17,
  weight: 3.5,
  allowedEquipSlotType: [ItemSlotType.Head],
};
