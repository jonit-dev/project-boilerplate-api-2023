import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemVikingHelmet: Partial<IItem> = {
  key: HelmetsBlueprint.VikingHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/viking-helmet.png",
  name: "Viking Helmet",
  description:
    "Viking helmets provided  protection by covering part of the face , and they also provided anonymity to the warriors.",
  defense: 8,
  weight: 2.4,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 57,
};
