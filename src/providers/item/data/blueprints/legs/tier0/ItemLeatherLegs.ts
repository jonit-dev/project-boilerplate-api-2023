import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemLeatherLegs: IEquippableLightArmorTier0Blueprint = {
  key: LegsBlueprint.LeatherLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/leather-legs.png",
  name: "Leather Legs",
  description: "A pair of simple leather legs.",
  defense: 3,
  tier: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Legs],
  basePrice: 41,
};
