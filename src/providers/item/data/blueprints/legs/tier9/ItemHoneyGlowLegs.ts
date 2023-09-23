import { IEquippableLightArmorTier9Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHoneyGlowLegs: IEquippableLightArmorTier9Blueprint = {
  key: LegsBlueprint.HoneyGlowLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/honey-glow-legs.png",
  name: "Honey Glow Legs",
  description: "Coated with a golden sheen, they offer a sweet allure and a touch of magic.",
  weight: 0.5,
  defense: 47,
  tier: 9,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
