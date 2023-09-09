import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableTwoHandedStaffTier4WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHellishStaff: IEquippableTwoHandedStaffTier4WeaponBlueprint = {
  key: StaffsBlueprint.HellishStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  textureAtlas: "items",
  texturePath: "staffs/hellish-staff.png",
  name: "Hellish Staff",
  description:
    "The Hellish Staff is primarily an offensive weapon, with a high Attack rating that allows mages to unleash devastating spells and incantations upon their enemies.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 36,
  defense: 10,
  tier: 4,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Red,
  isTwoHanded: true,
  maxRange: RangeTypes.High,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 70,
};
