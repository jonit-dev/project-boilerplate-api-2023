import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSorcerersVeil: IEquippableLightArmorTier2Blueprint = {
  key: HelmetsBlueprint.SorcerersVeil,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/sorcerers-veil.png",
  name: "Sorcerer's Veil",
  description:
    "The Sorcerer's Veil is a dark and foreboding headpiece that is steeped in ancient magic and occult lore.",
  weight: 1,
  defense: 10,
  tier: 2,
  allowedEquipSlotType: [ItemSlotType.Head],
};
