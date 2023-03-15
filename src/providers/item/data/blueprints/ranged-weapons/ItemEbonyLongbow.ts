import {
  EntityAttackType,
  IEquippableRangedWeaponTwoHandedBlueprint,
  ItemSlotType,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import { RangeTypes } from "../../types/RangedWeaponTypes";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemEbonyLongbow: IEquippableRangedWeaponTwoHandedBlueprint = {
  key: RangedWeaponsBlueprint.EbonyLongbow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  rangeType: EntityAttackType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/ebony-longbow.png",
  name: "Ebony Longbow",
  description: "A powerful, intimidating bow made from the dark, heavy wood of the ebony tree.",
  attack: 13,
  defense: 6,
  weight: 0.75,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.Medium,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Arrow, RangedWeaponsBlueprint.IronArrow],
  isTwoHanded: true,
  basePrice: 65,
};
