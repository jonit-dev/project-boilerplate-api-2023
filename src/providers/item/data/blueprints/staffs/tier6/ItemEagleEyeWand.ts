import { IEquippableTwoHandedStaffTier6WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEagleEyeWand: IEquippableTwoHandedStaffTier6WeaponBlueprint = {
  key: StaffsBlueprint.EagleEyeWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  textureAtlas: "items",
  texturePath: "staffs/eagle-eye-wand.png",
  name: "Eagle Eye wand",
  description:
    "Made from eagle feathers, this wand grants unparalleled accuracy. Useful for precise, long-distance spellcasting.",
  weight: 1.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 50,
  defense: 15,
  tier: 6,
  maxRange: RangeTypes.High,
  basePrice: 100,
  isTwoHanded: true,
};
