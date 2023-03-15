import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDeathsHelmet: IEquippableArmorBlueprint = {
  key: HelmetsBlueprint.DeathsHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/deaths-helmet.png",
  name: "Deaths Helmet",
  description: "This helmet is made from parts of a corrupted material.",
  defense: 4,
  weight: 0.7,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 41,
};
