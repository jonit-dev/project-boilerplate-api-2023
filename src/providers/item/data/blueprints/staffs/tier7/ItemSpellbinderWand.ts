import { IEquippableTwoHandedStaffTier7WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSpellbinderWand: IEquippableTwoHandedStaffTier7WeaponBlueprint = {
  key: StaffsBlueprint.SpellbinderWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  textureAtlas: "items",
  texturePath: "staffs/spellbinder-wand.png",
  name: "Spellbinder  Wand",
  description:
    "Covered in magical runes, this wand can copy and store one spell that the user has seen but not cast. Good for adaptive spellcasters.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 56,
  defense: 18,
  tier: 7,
  maxRange: RangeTypes.High,
  basePrice: 110,
  isTwoHanded: true,
};
