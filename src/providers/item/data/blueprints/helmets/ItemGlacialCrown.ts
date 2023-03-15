import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGlacialCrown: IEquippableArmorBlueprint = {
  key: HelmetsBlueprint.GlacialCrown,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/glacial-crown.png",
  name: "Glacial Crown",
  description: "The Glacial Crown is a magnificent headpiece crafted from ice and imbued with ancient magic. ",
  weight: 1,
  defense: 18,
  allowedEquipSlotType: [ItemSlotType.Head],
};
