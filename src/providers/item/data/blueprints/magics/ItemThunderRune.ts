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

export const itemThunderRune: IRuneItemBlueprint = {
  key: MagicsBlueprint.ThunderRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/thunder-rune.png",
  name: "Thunder Rune",
  description: "An ancient thunder rune.",
  weight: 0.01,
  maxStackSize: 100,

  canUseOnNonPVPZone: false,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: MagicPower.Medium,
  canSell: false,
  minMagicLevelRequired: 5,
  animationKey: AnimationEffectKeys.Energy,
  projectileAnimationKey: AnimationEffectKeys.Green,

  usableEffectKey: UsableEffectsBlueprint.ThunderRuneUsableEffect,
};
