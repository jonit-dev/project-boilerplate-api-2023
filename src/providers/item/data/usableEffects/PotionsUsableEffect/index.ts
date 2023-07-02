import { UsableEffectsBlueprint } from "../types";
import { lightBurningVialsUsableEffect, moderateBurningVialsUsableEffect } from "./BurningVialsUsableEffect";
import {
  lightPoisonVialUsableEffect,
  moderatePoisonVialUsableEffect,
  strongPoisonVialUsableEffect,
} from "./PoisonVialsUsableEffect";

export const potionsUsableEffects = {
  [UsableEffectsBlueprint.LightPoisonVialUsableEffect]: lightPoisonVialUsableEffect,
  [UsableEffectsBlueprint.ModeratePoisonVialUsableEffect]: moderatePoisonVialUsableEffect,
  [UsableEffectsBlueprint.StrongPoisonVialUsableEffect]: strongPoisonVialUsableEffect,

  [UsableEffectsBlueprint.LightBurningVialsUsableEffect]: lightBurningVialsUsableEffect,
  [UsableEffectsBlueprint.ModerateBurningVialsUsableEffect]: moderateBurningVialsUsableEffect,
};
