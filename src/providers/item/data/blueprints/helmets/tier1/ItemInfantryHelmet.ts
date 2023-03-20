import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemInfantryHelmet: IEquippableLightArmorTier1Blueprint = {
  key: HelmetsBlueprint.InfantryHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/infantry-helmet.png",

  name: "Infantry Helmet",
  description:
    "The helmet has movable cheek-guards on each side and a butted chainmail avantail to protect the backside of the neck.",
  defense: 6,
  tier: 1,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 53,
};
