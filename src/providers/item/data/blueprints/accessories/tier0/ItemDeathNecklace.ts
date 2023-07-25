import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableAccessoryTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDeathNecklace: IEquippableAccessoryTier0Blueprint = {
  key: AccessoriesBlueprint.DeathNecklace,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/death-necklace.png",
  name: "Death Necklace",
  description: "a dark necklace imbued with the energy of the dead.",
  attack: 2,
  defense: 1,
  tier: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 27,
};
