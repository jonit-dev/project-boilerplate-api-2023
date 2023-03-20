import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableAccessoryTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemElvenRing: IEquippableAccessoryTier0Blueprint = {
  key: AccessoriesBlueprint.ElvenRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/elven-ring.png",
  name: "Elven Ring",
  description:
    "A delicate and intricate ring crafted by the skilled hands of elven artisans. It is imbued with the magic and grace of the elven people.",
  attack: 3,
  defense: 2,
  tier: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 35,
};
