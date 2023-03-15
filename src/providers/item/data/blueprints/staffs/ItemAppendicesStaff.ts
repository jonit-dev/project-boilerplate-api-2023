import {
  AnimationEffectKeys,
  EntityAttackType,
  IEquippableStaffBlueprint,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemAppendicesStaff: IEquippableStaffBlueprint = {
  key: StaffsBlueprint.AppendicesStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  textureAtlas: "items",
  texturePath: "staffs/appendice's-staff.png",
  name: "Appendice's Staff",
  description:
    "A basic wooden staff used by novice mages learning the fundamentals of magic. It is a simple yet reliable tool for channeling magical energy.",
  attack: 7,
  defense: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  basePrice: 60,
  maxRange: RangeTypes.Medium,
  isTwoHanded: true,
};
