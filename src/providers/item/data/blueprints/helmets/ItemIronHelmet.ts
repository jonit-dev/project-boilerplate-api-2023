import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronHelmet: Partial<IItem> = {
  key: HelmetsBlueprint.IronHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/iron-helmet.png",
  name: "Iron Helmet",
  description:
    "Iron Helmet is part of the Iron Set, and is a Lightweight helmet also known as a war hat, is a type of helmet made of iron or steel.",
  defense: 10,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.Head],
  sellPrice: 20,
};
