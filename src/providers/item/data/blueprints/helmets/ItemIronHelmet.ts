import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronHelmet: IEquippableArmorBlueprint = {
  key: HelmetsBlueprint.IronHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/iron-helmet.png",
  name: "Iron Helmet",
  description:
    "Iron Helmet is part of the Iron Set, and is a Lightweight helmet also known as a war hat, is a type of helmet made of iron or steel.",
  defense: 10,
  weight: 2.4,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 65,
};
