import { IEquippableTwoHandedStaffTier12WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemVortexStaff: IEquippableTwoHandedStaffTier12WeaponBlueprint = {
  key: StaffsBlueprint.VortexStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Corruption,
  textureAtlas: "items",
  texturePath: "staffs/vortex-staff.png",
  name: "Vortex Staff",
  description:
    "Carved with intricate swirling patterns, this staff can create small vortexes to either suck in or eject objects. Great for utility and offense.",
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 90,
  defense: 50,
  tier: 12,
  maxRange: RangeTypes.High,
  basePrice: 170,
  isTwoHanded: true,
};
