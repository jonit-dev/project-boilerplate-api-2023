import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemStuddedLegs: IEquippableLightArmorTier1Blueprint = {
  key: LegsBlueprint.StuddedLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/studded-legs.png",
  name: "Studded Legs",
  description: "A pair of simple studded legs.",
  defense: 6,
  tier: 1,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.Legs],
  basePrice: 100,
};
