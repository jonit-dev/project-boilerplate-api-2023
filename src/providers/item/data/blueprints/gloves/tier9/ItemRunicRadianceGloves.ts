import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier9Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRunicRadianceGloves: IEquippableLightArmorTier9Blueprint = {
  key: GlovesBlueprint.RunicRadianceGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/runic-radiance-gloves.png",
  name: "Runic Radiance Gloves",
  description: "Encrusted with ancient runes, they are a source of spells long forgotten.",
  defense: 51,
  tier: 9,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 122,
};
