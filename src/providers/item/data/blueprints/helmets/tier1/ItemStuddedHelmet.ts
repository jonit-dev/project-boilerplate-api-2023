import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemStuddedHelmet: IEquippableLightArmorTier1Blueprint = {
  key: HelmetsBlueprint.StuddedHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/studded-helmet.png",

  name: "Studded Helmet",
  description: "Common and practical, a studded is an adequate protection against battlefield conditions.",
  defense: 4,
  tier: 1,
  weight: 0.6,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 41,
};
