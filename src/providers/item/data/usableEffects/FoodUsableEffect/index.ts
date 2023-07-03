import { clearBleedingUsableEffect } from "../ClearBleedingUsableEffect";
import { UsableEffectsBlueprint } from "../types";
import {
  minorEatingUsableEffect,
  moderateEatingUsableEffect,
  poisonEatingUsableEffect,
  strongEatingUsableEffect,
  superStrongEatingUsableEffect,
} from "./EatingUsableEffect";

export const foodsUsableEffect = {
  [UsableEffectsBlueprint.MinorEatingEffect]: minorEatingUsableEffect,
  [UsableEffectsBlueprint.ModerateEatingEffect]: moderateEatingUsableEffect,
  [UsableEffectsBlueprint.StrongEatingEffect]: strongEatingUsableEffect,
  [UsableEffectsBlueprint.SuperStrongEatingEffect]: superStrongEatingUsableEffect,
  [UsableEffectsBlueprint.PoisonEatingEffect]: poisonEatingUsableEffect,
  [UsableEffectsBlueprint.ClearBleedingUsableEffect]: clearBleedingUsableEffect,
};
