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

export const itemDarkRune: IRuneItemBlueprint = {
  key: MagicsBlueprint.DarkRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/dark-rune.png",
  name: "Dark Rune",
  description: "An ancient dark rune.",
  weight: 0.01,
  maxStackSize: 100,

  canUseOnNonPVPZone: false,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.High,
  power: MagicPower.High,
  canSell: false,
  minMagicLevelRequired: 8,
  animationKey: AnimationEffectKeys.HitDark,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  usableEffectKey: UsableEffectsBlueprint.DarkRuneUsableEffect,
};
