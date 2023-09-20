import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier9Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemOraclegripGloves: IEquippableLightArmorTier9Blueprint = {
  key: GlovesBlueprint.OraclegripGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/oraclegrip-gloves.png",
  name: "Oraclegrip Gloves",
  description: "Worn by prophets and seers, they grant visions of futures untold.",
  defense: 47,
  tier: 9,
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 116,
};
