import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { IEquippableTwoHandedStaffTier1WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFireWand: IEquippableTwoHandedStaffTier1WeaponBlueprint = {
  key: StaffsBlueprint.FireWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Red,
  textureAtlas: "items",
  texturePath: "staffs/fire-wand.png",
  name: "Fire Wand",
  description:
    "A wand or staff imbued with the power of flames, capable of generating and controlling intense heat and fire.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 12,
  defense: 4,
  tier: 1,
  maxRange: RangeTypes.Medium,
  basePrice: 60,
  isTwoHanded: true,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 80,
};
