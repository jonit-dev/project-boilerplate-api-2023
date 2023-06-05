import { EntityAttackType, ItemSlotType, ItemSubType, ItemType, RangeTypes } from "@rpg-engine/shared";
import { IEquippableRangedTier2WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEbonyLongbow: IEquippableRangedTier2WeaponBlueprint = {
  key: RangedWeaponsBlueprint.EbonyLongbow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  rangeType: EntityAttackType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/ebony-longbow.png",
  name: "Ebony Longbow",
  description: "A powerful, intimidating bow made from the dark, heavy wood of the ebony tree.",
  attack: 16,
  tier: 2,
  weight: 0.75,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: RangeTypes.Medium,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Arrow, RangedWeaponsBlueprint.IronArrow, RangedWeaponsBlueprint.FrostArrow],
  isTwoHanded: true,
  basePrice: 65,
};
