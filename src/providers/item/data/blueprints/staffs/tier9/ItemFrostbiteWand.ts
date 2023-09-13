import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableTwoHandedStaffTier9WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFrostbiteWand: IEquippableTwoHandedStaffTier9WeaponBlueprint = {
  key: StaffsBlueprint.FrostbiteWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Freeze,
  textureAtlas: "items",
  texturePath: "staffs/frostbite-wand.png",
  name: "Frostbite Wand",
  description:
    "Encrusted with ice crystals, this wand can freeze enemies solid or create icy barriers. Best used in defensive tactics.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 70,
  defense: 32,
  tier: 9,
  maxRange: RangeTypes.High,
  basePrice: 140,
  isTwoHanded: true,
  entityEffects: [EntityEffectBlueprint.Freezing],
  entityEffectChance: 85,
};
