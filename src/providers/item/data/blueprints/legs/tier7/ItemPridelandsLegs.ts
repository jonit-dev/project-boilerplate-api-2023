import { IEquippableLightArmorTier7Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPridelandsLegs: IEquippableLightArmorTier7Blueprint = {
  key: LegsBlueprint.PridelandsLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/pridelands-legs.png",
  name: "Pridelands Legs",
  description: "Crafted from the beasts of the vast savannah, they offer agility and freedom.",
  weight: 0.5,
  defense: 40,
  tier: 7,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
