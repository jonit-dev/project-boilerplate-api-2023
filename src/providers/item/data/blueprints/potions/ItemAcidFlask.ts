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

export const itemAcidFlask: IRuneItemBlueprint = {
  key: PotionsBlueprint.AcidFlask,
  type: ItemType.Tool,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/acid-flask.png",
  name: "Acid Flask",
  description: "A corrosive liquid that eats through armor and burns flesh.",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 20,

  canUseOnNonPVPZone: false,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: MagicPower.Low,
  canSell: false,
  minMagicLevelRequired: 7,
  animationKey: AnimationEffectKeys.HitPoison,
  projectileAnimationKey: AnimationEffectKeys.Green,
  usableEffectKey: UsableEffectsBlueprint.ModeratePoisonVialUsableEffect,
};
