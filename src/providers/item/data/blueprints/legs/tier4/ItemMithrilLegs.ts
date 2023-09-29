import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier4Blueprint } from "../../../types/TierBlueprintTypes";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemMithrilLegs: IEquippableLightArmorTier4Blueprint = {
  key: LegsBlueprint.MithrilLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/mithril-legs.png",
  name: "Mithril Legs",
  description: "A leg armor made of a rare, incredibly strong metal known as mithril",
  weight: 0.5,
  defense: 20,
  tier: 4,
  allowedEquipSlotType: [ItemSlotType.Legs],
  basePrice: 1000,
};
