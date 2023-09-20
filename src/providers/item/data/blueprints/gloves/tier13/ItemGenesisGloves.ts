import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier13Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGenesisGloves: IEquippableLightArmorTier13Blueprint = {
  key: GlovesBlueprint.GenesisGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/genesis-gloves.png",
  name: "Genesis Gloves",
  description: "Bursting with creation magic, they can conjure wonders from nothingness.",
  defense: 73,
  tier: 13,
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 161,
};
