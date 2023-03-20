import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGladiatorHelmet: IEquippableLightArmorTier2Blueprint = {
  key: HelmetsBlueprint.GladiatorHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/gladiator's-helmet.png",
  name: "Gladiator Helmet",
  description:
    "For antiquity, gladiator helmets were unique in their design. This helmet was designed to help maximize defense.",
  defense: 9,
  tier: 2,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 57,
};
