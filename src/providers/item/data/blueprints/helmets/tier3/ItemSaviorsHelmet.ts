import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSaviorsHelmet: IEquippableLightArmorTier3Blueprint = {
  key: HelmetsBlueprint.SaviorsHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/saviors-helmet.png",
  name: "Saviors Helmet",
  description: "The Salviors Helmet are made of tin and decorated with eagle feathers nas laterais.",
  defense: 16,
  tier: 3,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 93,
};
