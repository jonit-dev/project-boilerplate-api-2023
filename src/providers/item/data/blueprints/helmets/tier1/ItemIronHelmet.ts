import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemIronHelmet: IEquippableLightArmorTier1Blueprint = {
  key: HelmetsBlueprint.IronHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/iron-helmet.png",
  name: "Iron Helmet",
  description:
    "Iron Helmet is part of the Iron Set, and is a Lightweight helmet also known as a war hat, is a type of helmet made of iron or steel.",
  defense: 7,
  tier: 1,
  weight: 2.4,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 65,
};
