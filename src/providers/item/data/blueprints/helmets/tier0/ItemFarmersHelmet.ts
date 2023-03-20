import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFarmersHelmet: IEquippableLightArmorTier0Blueprint = {
  key: HelmetsBlueprint.FarmersHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/farmer-helmet.png",
  name: "Farmers Helmet",
  description: "A Simple farmer helmet made with cotton.",
  defense: 2,
  tier: 0,
  weight: 0.3,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 33,
};
