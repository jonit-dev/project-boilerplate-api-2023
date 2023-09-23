import { IEquippableLightArmorTier13Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDragonScaleLegs: IEquippableLightArmorTier13Blueprint = {
  key: LegsBlueprint.DragonScaleLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/dragon-scale-legs.png",
  name: "Dragon Scale Legs",
  description: "Crafted from the scales of a mighty dragon, they offer unparalleled protection.",
  weight: 0.8,
  defense: 72,
  tier: 13,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
