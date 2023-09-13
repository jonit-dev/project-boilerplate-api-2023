import { IEquippableTwoHandedStaffTier15WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGravityStaff: IEquippableTwoHandedStaffTier15WeaponBlueprint = {
  key: StaffsBlueprint.GravityStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  textureAtlas: "items",
  texturePath: "staffs/gravity-staff.png",
  name: "Gravity Staff",
  description:
    "Made of a heavy, dense material, this staff can manipulate gravitational fields. Effective for immobilizing enemies.",
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 112,
  defense: 90,
  tier: 15,
  maxRange: RangeTypes.High,
  basePrice: 210,
  isTwoHanded: true,
};
