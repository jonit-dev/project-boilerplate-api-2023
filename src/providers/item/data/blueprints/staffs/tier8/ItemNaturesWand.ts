import { IEquippableTwoHandedStaffTier8WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemNaturesWand: IEquippableTwoHandedStaffTier8WeaponBlueprint = {
  key: StaffsBlueprint.NaturesWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Green,
  textureAtlas: "items",
  texturePath: "staffs/natures-wand.png",
  name: "Natures Wand",
  description:
    "Carved from an ancient oak and entwined with living vines, this wand controls plant life. Great for ensnaring enemies or healing allies.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 62,
  defense: 20,
  tier: 8,
  maxRange: RangeTypes.High,
  basePrice: 120,
  isTwoHanded: true,
};
