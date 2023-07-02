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

export const itemBlazingFirebomb: IRuneItemBlueprint = {
  key: PotionsBlueprint.BlazingFirebomb,
  type: ItemType.Tool,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/blazing-firebomb.png",
  name: "Blazing Firebomb",
  description: "A volatile concoction that erupts in a blazing inferno, engulfing enemies in searing flames.",
  weight: 0.01,
  maxStackSize: 100,

  canUseOnNonPVPZone: false,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: MagicPower.High,
  canSell: false,
  basePrice: 30,
  minMagicLevelRequired: 7,
  animationKey: AnimationEffectKeys.HitFire,
  projectileAnimationKey: AnimationEffectKeys.FireBall,
  usableEffectKey: UsableEffectsBlueprint.LightBurningVialsUsableEffect,
};
