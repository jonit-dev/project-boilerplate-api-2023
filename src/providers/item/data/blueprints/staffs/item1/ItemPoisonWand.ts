import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { IEquippableTwoHandedStaffTier1WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPoisonWand: IEquippableTwoHandedStaffTier1WeaponBlueprint = {
  key: StaffsBlueprint.PoisonWand,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  rangeType: EntityAttackType.Ranged,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  textureAtlas: "items",
  texturePath: "staffs/poison-wand.png",
  name: "Poison Wand",
  description: "A toxic wand or rod imbued with poison, capable of releasing deadly venom and causing injury or death.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 13,
  defense: 10,
  tier: 1,
  maxRange: RangeTypes.Short,
  basePrice: 75,
  isTwoHanded: true,
  entityEffects: [EntityEffectBlueprint.Poison],
  entityEffectChance: 70,
};
