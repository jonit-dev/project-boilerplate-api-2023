import {
  AnimationEffectKeys,
  IRuneItemBlueprint,
  ItemSubType,
  ItemType,
  MagicPower,
  RangeTypes,
} from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemFieryConcussion: IRuneItemBlueprint = {
  key: PotionsBlueprint.FieryConcussion,
  type: ItemType.Tool,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/fiery-concussion.png",
  name: "Fiery Concussion",
  description: "Ignite chaos with a fiery blast, engulfing enemies in a searing wave of heat and destructive force.",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 40,
  canUseOnNonPVPZone: false,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: MagicPower.Medium,
  canSell: false,
  minMagicLevelRequired: 12,
  animationKey: AnimationEffectKeys.HitFire,
  projectileAnimationKey: AnimationEffectKeys.FireBall,

  usableEffectKey: UsableEffectsBlueprint.ModerateBurningVialsUsableEffect,
};
