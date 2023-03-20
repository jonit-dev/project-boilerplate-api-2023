import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSoldiersHelmet: IEquippableLightArmorTier1Blueprint = {
  key: HelmetsBlueprint.SoldiersHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/soldiers-helmet.png",

  name: "Soldiers Helmet",
  description: "A helmet used by standard soldier.",
  defense: 7,
  tier: 1,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 53,
};
