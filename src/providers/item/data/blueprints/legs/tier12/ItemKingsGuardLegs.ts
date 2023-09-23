import { IEquippableLightArmorTier12Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemKingsGuardLegs: IEquippableLightArmorTier12Blueprint = {
  key: LegsBlueprint.KingsGuardLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/kings-guard-legs.png",
  name: "Kings Guard Legs",
  description: "Worn by the elite protectors of the realm, signaling authority and might.",
  weight: 0.6,
  defense: 68,
  tier: 12,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
