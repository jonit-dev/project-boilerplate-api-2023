import { IEquippableLightArmorTier11Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDwarvenLegs: IEquippableLightArmorTier11Blueprint = {
  key: LegsBlueprint.DwarvenLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/dwarven-legs.png",
  name: "Dwarven Legs",
  description: "Forged deep within the mountain halls, these legs bear the sturdy craftsmanship of the dwarves.",
  weight: 0.5,
  defense: 63,
  tier: 11,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
