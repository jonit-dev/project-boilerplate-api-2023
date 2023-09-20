import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier12Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemShadowlordGloves: IEquippableLightArmorTier12Blueprint = {
  key: GlovesBlueprint.ShadowlordGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/shadowlord-gloves.png",
  name: "Shadowlord Gloves",
  description: "Imbued with the obsidian essence of dark lords, they grant mastery over the shadows.",
  defense: 66,
  tier: 12,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 149,
};
