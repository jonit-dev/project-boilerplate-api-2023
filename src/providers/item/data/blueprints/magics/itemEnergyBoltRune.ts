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

export const itemEnergyBoltRune: IRuneItemBlueprint = {
  key: MagicsBlueprint.EnergyBoltRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/energy-bolt-rune.png",
  name: "Energy Bolt Rune",
  description: "An ancient Energy Bolt Rune.",
  weight: 0.01,
  maxStackSize: 100,
  hasUseWith: true,
  canUseOnNonPVPZone: false,

  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: MagicPower.Medium,
  minMagicLevelRequired: 3,
  canSell: false,
  animationKey: AnimationEffectKeys.Hit,
  projectileAnimationKey: AnimationEffectKeys.Energy,

  usableEffectKey: UsableEffectsBlueprint.EnergyBoltRuneUsableEffect,
};
