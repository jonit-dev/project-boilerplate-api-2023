import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWingHelmet: IEquippableLightArmorTier3Blueprint = {
  key: HelmetsBlueprint.WingHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/wing-helmet.png",
  name: "Wing Helmet",
  description:
    "You see a wing helmet. It's decorated with wings and ancient depictions of the god Hermes, Mercury and of Roma.",
  defense: 13,
  tier: 3,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 73,
};
