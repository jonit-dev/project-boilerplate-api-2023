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

export const itemWinterspireStaff: IEquippableTwoHandedStaffTier10WeaponBlueprint = {
  key: StaffsBlueprint.WinterspireStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Freeze,
  textureAtlas: "items",
  texturePath: "staffs/winterspire-staff.png",
  name: "Winterspire Staff",
  description:
    "Perpetually coated in frost, this staff can freeze foes in their tracks. Ideal for controlling space in battles.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 78,
  defense: 45,
  tier: 10,
  maxRange: RangeTypes.High,
  basePrice: 150,
  isTwoHanded: true,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 80,
};
