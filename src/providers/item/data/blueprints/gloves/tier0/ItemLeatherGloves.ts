import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemLeatherGloves: IEquippableLightArmorTier0Blueprint = {
  key: GlovesBlueprint.LeatherGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/leather-gloves.png",

  name: "Leather Gloves",
  description: "A pair of simple leather gloves.",
  defense: 2,
  tier: 0,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 33,
};
