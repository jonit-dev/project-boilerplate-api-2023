import { IEquippableLightArmorTier6Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRustedIronLegs: IEquippableLightArmorTier6Blueprint = {
  key: LegsBlueprint.RustedIronLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/rusted-iron-legs.png",
  name: "Rusted Iron Legs",
  description: "Though worn by time, they have seen countless battles and still stand strong.",
  weight: 1,
  defense: 30,
  tier: 6,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
