import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier8Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemJadeclaspGloves: IEquippableLightArmorTier8Blueprint = {
  key: GlovesBlueprint.JadeclaspGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/jadeclasp-gloves.png",
  name: "Jadeclasp Gloves",
  description: "Radiating the lustrous shine of jade stones, they harmonize energy flows.",
  defense: 44,
  tier: 8,
  weight: 1.3,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 112,
};
