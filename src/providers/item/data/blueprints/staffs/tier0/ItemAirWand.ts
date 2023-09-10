import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { IEquippableTwoHandedStaffTier0WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemAirWand: IEquippableTwoHandedStaffTier0WeaponBlueprint = {
  key: StaffsBlueprint.AirWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Blue,
  textureAtlas: "items",
  texturePath: "staffs/air-wand.png",
  name: "Air Wand",
  description:
    "A type of wand or staff imbued with the power of wind and air, capable of harnessing and manipulating these elements.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 8,
  defense: 2,
  tier: 0,
  basePrice: 25,
  maxRange: RangeTypes.Short,
  isTwoHanded: true,
};
