import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemLeatherHelmet: IEquippableLightArmorTier0Blueprint = {
  key: HelmetsBlueprint.LeatherHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/leather-helmet.png",

  name: "Leather Helmet",
  description: "It is wind-proof and not accumulating dust and protect from the cold.",
  defense: 4,
  tier: 0,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 41,
};
