import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier10Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRoyalDecreeGloves: IEquippableLightArmorTier10Blueprint = {
  key: GlovesBlueprint.RoyalDecreeGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/royal-decree-gloves.png",
  name: "Royal Decree Gloves",
  description: "Crafted for monarchs, these gloves exude opulence and command respect.",
  defense: 54,
  tier: 10,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 129,
};
