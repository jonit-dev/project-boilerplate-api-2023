import {
  AnimationEffectKeys,
  EntityAttackType,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";

import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableTwoHandedStaffTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { StaffsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEmberward: IEquippableTwoHandedStaffTier3WeaponBlueprint = {
  key: StaffsBlueprint.Emberward,
  type: ItemType.Weapon,
  subType: ItemSubType.Staff,
  projectileAnimationKey: AnimationEffectKeys.Burn,
  rangeType: EntityAttackType.Ranged,
  maxRange: RangeTypes.Medium,
  textureAtlas: "items",
  texturePath: "staffs/emberward.png",
  name: "Emberward",
  description:
    "The Emberward staff is a powerful weapon that channels the element of fire. At the top of the staff sits a glowing orange gemstone, pulsing with intense heat. With a flick of the wrist, the wielder can unleash torrents of searing fire upon their enemies, leaving a trail of ash and embers in their wake.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 25,
  defense: 6,
  tier: 3,
  basePrice: 86,
  isTwoHanded: true,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 80,
};
