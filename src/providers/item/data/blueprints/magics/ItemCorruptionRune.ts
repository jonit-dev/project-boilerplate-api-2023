import {
  AnimationEffectKeys,
  IRuneItemBlueprint,
  ItemSubType,
  ItemType,
  MagicPower,
  RangeTypes,
} from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemCorruptionRune: IRuneItemBlueprint = {
  key: MagicsBlueprint.CorruptionRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/corruption-rune.png",
  name: "Corruption Rune",
  description: "The forbidden Corruption of Xoranth, the dark God, corrupts all who succumb to its influence",
  weight: 0.01,
  maxStackSize: 100,

  hasUseWith: true,
  canUseOnNonPVPZone: false,
  useWithMaxDistanceGrid: RangeTypes.High,
  power: MagicPower.UltraHigh,
  canSell: false,
  minMagicLevelRequired: 10,
  animationKey: AnimationEffectKeys.HitCorruption,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  usableEffectKey: UsableEffectsBlueprint.CorruptionRuneUsableEffect,
};
