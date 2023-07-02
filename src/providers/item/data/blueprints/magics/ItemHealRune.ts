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

export const itemHealRune: IRuneItemBlueprint = {
  key: MagicsBlueprint.HealRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/heal-rune.png",

  name: "Healing Rune",
  description: "An ancient healing rune.",
  weight: 0.01,
  maxStackSize: 100,

  hasUseWith: true,
  canUseOnNonPVPZone: true,
  useWithMaxDistanceGrid: RangeTypes.Short,
  power: MagicPower.High,
  minMagicLevelRequired: RangeTypes.High,
  canSell: false,
  animationKey: AnimationEffectKeys.HitHeal,
  projectileAnimationKey: AnimationEffectKeys.Heal,

  usableEffectKey: UsableEffectsBlueprint.HealRuneUsableEffect,
};
