import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFalconsLegs: IEquippableLightArmorTier3Blueprint = {
  key: LegsBlueprint.FalconsLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/falcons-legs.png",
  name: "Falcon's Legs",
  description:
    "The legs are often adorned with intricate patterns and designs that evoke the grace and speed of the majestic falcon. ",
  weight: 1,
  defense: 16,
  tier: 3,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
