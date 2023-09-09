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

export const itemGaleforceStaff: IEquippableTwoHandedStaffTier15WeaponBlueprint = {
  key: StaffsBlueprint.GaleforceStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Corruption,
  textureAtlas: "items",
  texturePath: "staffs/galeforce-staff.png",
  name: "Galeforce Staff",
  description:
    "Masterfully crafted from wind-hardened wood, this staff can command gales and tornadoes. Ideal for controlling the battlefield from a distance.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 109,
  defense: 80,
  tier: 15,
  maxRange: RangeTypes.High,
  basePrice: 200,
  isTwoHanded: true,
};
