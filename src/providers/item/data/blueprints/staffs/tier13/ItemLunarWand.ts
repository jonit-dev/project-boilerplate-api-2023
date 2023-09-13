import { IEquippableTwoHandedStaffTier13WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemLunarWand: IEquippableTwoHandedStaffTier13WeaponBlueprint = {
  key: StaffsBlueprint.LunarWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.QuickFire,
  textureAtlas: "items",
  texturePath: "staffs/lunar-wand.png",
  name: "Lunar Wand",
  description:
    "Infused with the essence of the moon, this wand grants unique abilities that change with the lunar phases. Potency varies throughout the month.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 98,
  defense: 62,
  tier: 13,
  maxRange: RangeTypes.High,
  basePrice: 180,
  isTwoHanded: true,
};
