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

export const itemRubyStaff: IEquippableStaffBlueprint = {
  key: StaffsBlueprint.RubyStaff,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Red,
  textureAtlas: "items",
  texturePath: "staffs/ruby-staff.png",
  name: "Ruby Staff",
  description:
    "A staff adorned with sparkling rubies, symbolizing wealth and prosperity. It is also imbued with powerful magical energy.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 11,
  defense: 6,
  maxRange: RangeTypes.Medium,
  basePrice: 90,
  isTwoHanded: true,
};
