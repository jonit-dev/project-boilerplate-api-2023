import { UsableEffectsBlueprint } from "../types";
import { corruptionRuneUsableEffect } from "./corruptionRuneUsableEffect";
import { darkRuneUsableEffect } from "./darkRuneUsableEffect";
import { energyBoltRune } from "./energyBoltUsableEffect";
import { fireRuneUsableEffect } from "./fireRuneUsableEffect";
import { fireBoltRuneUsableEffect } from "./fireboltRuneUsableEffect";
import { healRuneUsableEffect } from "./healRuneUsableEffect";
import { poisonRuneUsableEffect } from "./poisonRuneUsableEffect";
import { thunderRuneUsableEffect } from "./thunderRuneUsableEffect";

export const runesUsableEffects = {
  [UsableEffectsBlueprint.CorruptionRuneUsableEffect]: corruptionRuneUsableEffect,
  [UsableEffectsBlueprint.DarkRuneUsableEffect]: darkRuneUsableEffect,
  [UsableEffectsBlueprint.EnergyBoltRuneUsableEffect]: energyBoltRune,
  [UsableEffectsBlueprint.FireBoltRuneUsableEffect]: fireBoltRuneUsableEffect,
  [UsableEffectsBlueprint.FireRuneUsableEffect]: fireRuneUsableEffect,
  [UsableEffectsBlueprint.HealRuneUsableEffect]: healRuneUsableEffect,
  [UsableEffectsBlueprint.PoisonRuneUsableEffect]: poisonRuneUsableEffect,
  [UsableEffectsBlueprint.ThunderRuneUsableEffect]: thunderRuneUsableEffect,
};
