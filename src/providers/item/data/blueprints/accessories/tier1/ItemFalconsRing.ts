import { IEquippableAccessoryTier1Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFalconsRing: IEquippableAccessoryTier1Blueprint = {
  key: AccessoriesBlueprint.FalconsRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/falcons-ring.png",
  name: "Falcon's Ring",
  description:
    "Striking and ornate piece of jewelry that is often worn by knights and other chivalrous warriors who embody the virtues of bravery, honor, and loyalty.",
  weight: 1,
  attack: 6,
  defense: 6,
  tier: 1,
  allowedEquipSlotType: [ItemSlotType.Ring],
};
