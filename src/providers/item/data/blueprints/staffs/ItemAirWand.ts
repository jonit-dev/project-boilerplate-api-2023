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

export const itemAirWand: IEquippableStaffBlueprint = {
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
  attack: 7,
  defense: 3,
  basePrice: 70,
  maxRange: RangeTypes.Short,
  isTwoHanded: true,
};
