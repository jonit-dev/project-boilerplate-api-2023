import { IEquippableLightArmorTier6Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPlatinumTintLegs: IEquippableLightArmorTier6Blueprint = {
  key: LegsBlueprint.PlatinumTintLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/platinum-tint-legs.png",
  name: "Platinum Tint Legs",
  description: "Glistening with a platinum sheen, these leggings epitomize the apex of craftsmanship and defense",
  weight: 0.5,
  defense: 34,
  tier: 6,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
