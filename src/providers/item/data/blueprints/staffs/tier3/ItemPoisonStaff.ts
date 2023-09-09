import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { IEquippableTwoHandedStaffTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPoisonStaff: IEquippableTwoHandedStaffTier3WeaponBlueprint = {
  key: StaffsBlueprint.PoisonStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  textureAtlas: "items",
  texturePath: "staffs/poison-staff.png",
  name: "Poison Staff",
  description:
    "A staff imbued with powerful toxins and venom, capable of releasing deadly poison on contact and causing serious injury or death.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 24,
  defense: 6,
  tier: 3,
  basePrice: 85,
  maxRange: RangeTypes.Medium,
  isTwoHanded: true,
  entityEffects: [EntityEffectBlueprint.Poison],
  entityEffectChance: 80,
};
