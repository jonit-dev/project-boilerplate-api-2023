import { UsableEffectsBlueprint } from "../types";
import { lightBurningVialsUsableEffect, moderateBurningVialsUsableEffect } from "./BurningVialsUsableEffect";
import {
  lightPoisonVialUsableEffect,
  moderatePoisonVialUsableEffect,
  strongPoisonVialUsableEffect,
} from "./PoisonVialsUsableEffect";
import {
  LightManaPotionUsableEffect,
  antidotePotionUsableEffect,
  greaterLifePotionUsableEffect,
  greaterManaPotionUsableEffect,
  lifePotionUsableEffect,
  lightEndurancePotionUsableEffect,
  lightLifePotionUsableEffect,
  manaPotionUsableEffect,
} from "./PotionsUsableEffect";

export const potionsUsableEffects = {
  [UsableEffectsBlueprint.LightPoisonVialUsableEffect]: lightPoisonVialUsableEffect,
  [UsableEffectsBlueprint.ModeratePoisonVialUsableEffect]: moderatePoisonVialUsableEffect,
  [UsableEffectsBlueprint.StrongPoisonVialUsableEffect]: strongPoisonVialUsableEffect,

  [UsableEffectsBlueprint.LightBurningVialsUsableEffect]: lightBurningVialsUsableEffect,
  [UsableEffectsBlueprint.ModerateBurningVialsUsableEffect]: moderateBurningVialsUsableEffect,

  [UsableEffectsBlueprint.LightLifePotionUsableEffect]: lightLifePotionUsableEffect,
  [UsableEffectsBlueprint.LifePotionUsableEffect]: lifePotionUsableEffect,
  [UsableEffectsBlueprint.GreaterLifePotionUsableEffect]: greaterLifePotionUsableEffect,

  [UsableEffectsBlueprint.LightManaPotionUsableEffect]: LightManaPotionUsableEffect,
  [UsableEffectsBlueprint.ManaPotionUsableEffect]: manaPotionUsableEffect,
  [UsableEffectsBlueprint.GreaterManaPotionUsableEffect]: greaterManaPotionUsableEffect,

  [UsableEffectsBlueprint.AntidotePotionUsableEffect]: antidotePotionUsableEffect,
  [UsableEffectsBlueprint.LightEndurancePotionUsableEffect]: lightEndurancePotionUsableEffect,
};
