import {
  EntityAttackType,
  IEquippableRangedWeaponOneHandedBlueprint,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { RangeTypes } from "../../types/RangedWeaponTypes";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemShuriken: IEquippableRangedWeaponOneHandedBlueprint = {
  key: RangedWeaponsBlueprint.Shuriken,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  maxRange: RangeTypes.Short,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/shuriken-qty-1.png",
  name: "Shuriken",
  description: "A weapon in the form of a star with projecting blades",
  attack: 12,
  defense: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxStackSize: 50,
  basePrice: 5,
  canSell: false,
};
