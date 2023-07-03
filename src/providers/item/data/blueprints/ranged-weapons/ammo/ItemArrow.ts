import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.Arrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/arrow.png",
  name: "Arrow",
  description: "An iron head arrow.",
  attack: 8,
  weight: 0.01,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 999,
  basePrice: 1,
  canSell: false,
};
