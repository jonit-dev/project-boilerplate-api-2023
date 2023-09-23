import { IEquippableLightArmorTier7Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBlueLegs: IEquippableLightArmorTier7Blueprint = {
  key: LegsBlueprint.BlueLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/blue-legs.png",
  name: "Blue Legs",
  description: "Dyed with the purest of blue, these pants shimmer like a clear summer sky.",
  weight: 0.4,
  defense: 37,
  tier: 7,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
