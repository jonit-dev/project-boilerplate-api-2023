import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHeartseekerArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.HeartseekerArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/heartseeker-arrow.png",
  name: "Heartseeker Arrow",
  description: "Enchanted to always find the heart of the target. Highly effective for delivering critical hits.",
  weight: 0.1,
  maxStackSize: 999,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 8,
  attack: 25,
  canSell: false,
};
