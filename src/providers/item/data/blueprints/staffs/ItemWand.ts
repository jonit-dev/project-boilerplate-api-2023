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

export const itemWand: IEquippableStaffBlueprint = {
  key: StaffsBlueprint.Wand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Blue,
  textureAtlas: "items",
  texturePath: "staffs/wand.png",
  name: "Wand",
  description:
    "A powerful magic wand crafted by the dark lord Sauron himself, imbued with malevolent energy and deadly magical power.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 7,
  defense: 1,
  maxRange: RangeTypes.Short,
  basePrice: 50,
  isTwoHanded: true,
};
