import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBronzeLegs: IEquippableLightArmorTier2Blueprint = {
  key: LegsBlueprint.BronzeLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/bronze-legs.png",
  name: "Bronze Legs",
  description: "A Leg armor made of bronze.",
  weight: 1.8,
  defense: 10,
  tier: 2,
  allowedEquipSlotType: [ItemSlotType.Legs],
  basePrice: 300,
};
