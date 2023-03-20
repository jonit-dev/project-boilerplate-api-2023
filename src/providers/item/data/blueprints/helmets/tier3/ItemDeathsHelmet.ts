import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDeathsHelmet: IEquippableLightArmorTier3Blueprint = {
  key: HelmetsBlueprint.DeathsHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/deaths-helmet.png",
  name: "Deaths Helmet",
  description: "This helmet is made from parts of a corrupted material.",
  defense: 13,
  weight: 0.7,
  tier: 3,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 41,
};
