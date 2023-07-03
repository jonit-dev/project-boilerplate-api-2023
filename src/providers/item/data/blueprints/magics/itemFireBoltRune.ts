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

export const itemFireBoltRune: IRuneItemBlueprint = {
  key: MagicsBlueprint.FireBoltRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/fire-bolt-rune.png",
  name: "Fire Bolt Rune",
  description: "An ancient Fire Bolt Rune.",
  weight: 0.01,
  maxStackSize: 100,
  hasUseWith: true,

  canUseOnNonPVPZone: false,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: MagicPower.Medium,
  minMagicLevelRequired: 5,
  canSell: false,
  animationKey: AnimationEffectKeys.Hit,
  projectileAnimationKey: AnimationEffectKeys.Red,
  usableEffectKey: UsableEffectsBlueprint.FireBoltRuneUsableEffect,
};
