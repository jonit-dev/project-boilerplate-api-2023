import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPlateGloves: IEquippableLightArmorTier3Blueprint = {
  key: GlovesBlueprint.PlateGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/plate-gloves.png",

  name: "Plate Gloves",
  description: "A pair of plated gloves.",
  defense: 13,
  tier: 3,
  weight: 1.3,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 65,
};
