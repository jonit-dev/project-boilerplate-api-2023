import { IEquippableLightArmorTier10Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemTempestLegs: IEquippableLightArmorTier10Blueprint = {
  key: LegsBlueprint.TempestLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/tempest-legs.png",
  name: "Tempest Legs",
  description: "Whispers of storms and winds are held within, allowing swift movements.",
  weight: 0.5,
  defense: 56,
  tier: 10,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
