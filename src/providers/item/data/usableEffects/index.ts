import { clearBleedingUsableEffect } from "./ClearBleedingUsableEffect";
import {
  minorEatingUsableEffect,
  moderateEatingUsableEffect,
  poisonEatingUsableEffect,
  strongEatingUsableEffect,
  superStrongEatingUsableEffect,
} from "./EatingUsableEffect";
import { runesUsableEffects } from "./RunesUsableEffect";
import { UsableEffectsBlueprint } from "./types";

const usableEffectsIndex = {
  // Foods
  [UsableEffectsBlueprint.MinorEatingEffect]: minorEatingUsableEffect,
  [UsableEffectsBlueprint.ModerateEatingEffect]: moderateEatingUsableEffect,
  [UsableEffectsBlueprint.StrongEatingEffect]: strongEatingUsableEffect,
  [UsableEffectsBlueprint.SuperStrongEatingEffect]: superStrongEatingUsableEffect,
  [UsableEffectsBlueprint.PoisonEatingEffect]: poisonEatingUsableEffect,
  [UsableEffectsBlueprint.ClearBleedingUsableEffect]: clearBleedingUsableEffect,

  // Runes
  ...runesUsableEffects,
};

export { usableEffectsIndex };
