import { IEquippableAccessoryTier0Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { AccessoriesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemBandana: IEquippableAccessoryTier0Blueprint = {
  key: AccessoriesBlueprint.Bandana,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/bandana.png",
  name: "Bandana",
  description: "a simple cloth bandana.",
  attack: 0,
  defense: 1,
  tier: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 1,
};
