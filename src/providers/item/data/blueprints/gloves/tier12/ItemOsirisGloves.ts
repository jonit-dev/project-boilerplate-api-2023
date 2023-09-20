import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier12Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemOsirisGloves: IEquippableLightArmorTier12Blueprint = {
  key: GlovesBlueprint.OsirisGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/osiris-gloves.png",
  name: "Osiris Gloves",
  description: "Holding ancient Egyptian might, they are the key to life, death, and rebirth.",
  defense: 69,
  tier: 12,
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 154,
};
