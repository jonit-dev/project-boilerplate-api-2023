import { IEquippableLightArmorTier11Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemIvoryMoonLegs: IEquippableLightArmorTier11Blueprint = {
  key: LegsBlueprint.IvoryMoonLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/ivory-moon-legs.png",
  name: "Ivory Moon Legs",
  description: "Bathed in lunar magic, these legs gleam with an ethereal glow.",
  weight: 0.9,
  defense: 60,
  tier: 11,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
