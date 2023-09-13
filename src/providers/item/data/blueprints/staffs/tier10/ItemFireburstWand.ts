import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableTwoHandedStaffTier10WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFireburstWand: IEquippableTwoHandedStaffTier10WeaponBlueprint = {
  key: StaffsBlueprint.FireburstWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.FireBall,
  textureAtlas: "items",
  texturePath: "staffs/fireburst-wand.png",
  name: "Fireburst Wand",
  description:
    "Wrapped in red dragon scales, this wand can produce bursts of flame. Effective for area damage and setting the battlefield ablaze.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 75,
  defense: 34,
  tier: 10,
  maxRange: RangeTypes.High,
  basePrice: 140,
  isTwoHanded: true,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 90,
};
