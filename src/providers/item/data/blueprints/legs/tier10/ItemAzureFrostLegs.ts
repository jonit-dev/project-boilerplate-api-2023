import { IEquippableLightArmorTier10Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemAzureFrostLegs: IEquippableLightArmorTier10Blueprint = {
  key: LegsBlueprint.AzureFrostLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/azure-frost-legs.png",
  name: "Azure Frost Legs",
  description: "Holding the chill of the northern glaciers, they provide coolness even in the heat of battle.",
  weight: 0.6,
  defense: 53,
  tier: 10,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
