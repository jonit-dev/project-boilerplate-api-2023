import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier6Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGlovesOfGrace: IEquippableLightArmorTier6Blueprint = {
  key: GlovesBlueprint.GlovesOfGrace,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/gloves-of-grace.png",
  name: "Gloves Of Grace",
  description: "Preferred by elven royalty, they are as elegant as they are protective.",
  defense: 30,
  tier: 6,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 90,
};
