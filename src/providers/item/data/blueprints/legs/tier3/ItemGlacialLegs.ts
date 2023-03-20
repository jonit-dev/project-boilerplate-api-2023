import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGlacialLegs: IEquippableLightArmorTier3Blueprint = {
  key: LegsBlueprint.GlacialLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/glacial-legs.png",
  name: "Glacial Legs",
  description:
    "The Glacial Legs are a set of formidable leg armor that is said to have been forged from the icy glaciers of the far north",
  weight: 1,
  defense: 16,
  tier: 3,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
