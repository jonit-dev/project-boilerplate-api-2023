import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier11Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPyroclasmGloves: IEquippableLightArmorTier11Blueprint = {
  key: GlovesBlueprint.PyroclasmGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/pyroclasm-gloves.png",
  name: "Pyroclasm Gloves",
  description: "Drawing from volcanic might, these gloves can unleash torrents of molten rage.",
  defense: 62,
  tier: 11,
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 142,
};
