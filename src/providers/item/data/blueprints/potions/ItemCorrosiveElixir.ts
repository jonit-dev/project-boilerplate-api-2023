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

export const itemCorrosiveElixir: IRuneItemBlueprint = {
  key: PotionsBlueprint.CorrosiveElixir,
  type: ItemType.Tool,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/corrosive-elixir.png",
  name: "Corrosive Elixir",
  description: "Granting resistance to acid attacks and imbuing melee strikes with a corrosive touch.",
  weight: 0.01,
  maxStackSize: 100,
  canUseOnNonPVPZone: false,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: MagicPower.High,
  canSell: false,
  minMagicLevelRequired: 5,
  basePrice: 80,
  animationKey: AnimationEffectKeys.HitPoison,
  projectileAnimationKey: AnimationEffectKeys.Green,
  usableEffectKey: UsableEffectsBlueprint.StrongPoisonVialUsableEffect,
};
