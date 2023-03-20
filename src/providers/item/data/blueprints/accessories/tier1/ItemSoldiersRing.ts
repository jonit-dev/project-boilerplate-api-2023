import { IEquippableAccessoryTier1Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSoldiersRing: IEquippableAccessoryTier1Blueprint = {
  key: AccessoriesBlueprint.SoldiersRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/soldiers-ring.png",
  name: "Soldiers Ring",
  description:
    "A simple and utilitarian ring worn by soldiers and warriors. It is a symbol of loyalty and service, and is often given as a token of honor or recognition.",
  attack: 5,
  defense: 3,
  tier: 1,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 30,
};
