import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBrassHelmet: IEquippableLightArmorTier1Blueprint = {
  key: HelmetsBlueprint.BrassHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/brass-helmet.png",
  name: "Brass Helmet",
  description: "A brass helmet.",
  defense: 5,
  tier: 1,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 45,
};
