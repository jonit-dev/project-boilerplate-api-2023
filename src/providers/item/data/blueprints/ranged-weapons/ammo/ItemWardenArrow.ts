import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWardenArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.WardenArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/warden-arrow.png",
  name: "Warden Arrow",
  description:
    "Designed by skilled rangers, these arrows mark the target, making it easier for allies to focus their attacks.",
  weight: 0.08,
  maxStackSize: 999,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 5,
  attack: 14,
  canSell: false,
};
