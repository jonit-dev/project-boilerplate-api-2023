import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableAccessoryTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWolfToothChain: IEquippableAccessoryTier0Blueprint = {
  key: AccessoriesBlueprint.WolfToothChain,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/wolf-tooth-chain.png",
  name: "Wolf Tooth Chain",
  description:
    "A necklace made of chain links with wolf teeth strung along the length of the chain. It is often worn as a symbol of strength and ferocity.",
  attack: 1,
  defense: 0,
  tier: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 32,
};
