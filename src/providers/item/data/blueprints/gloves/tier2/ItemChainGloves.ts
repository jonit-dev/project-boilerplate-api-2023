import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemChainGloves: IEquippableLightArmorTier2Blueprint = {
  key: GlovesBlueprint.ChainGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/chain-gloves.png",

  name: "Chain Gloves",
  description: "A pair of metal chain gloves.",
  defense: 10,
  tier: 2,
  weight: 0.7,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 49,
};
