import {
  EntityAttackType,
  IEquippableRangedWeaponTwoHandedBlueprint,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { RangeTypes } from "../../types/RangedWeaponTypes";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDragonBow: IEquippableRangedWeaponTwoHandedBlueprint = {
  key: RangedWeaponsBlueprint.DragonBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/dragon-bow.png",
  name: "Dragon Bow",
  description: "A powerful bow made from dragon bones.",
  attack: 40,
  defense: 12,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.High,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.GoldenArrow,
    RangedWeaponsBlueprint.PoisonArrow,
    RangedWeaponsBlueprint.ShockArrow,
  ],
  isTwoHanded: true,
  basePrice: 90,
};
