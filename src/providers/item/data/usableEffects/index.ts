import { foodsUsableEffect } from "./FoodUsableEffect";
import { potionsUsableEffects } from "./PotionsUsableEffect";
import { runesUsableEffects } from "./RunesUsableEffect";

const usableEffectsIndex = {
  ...foodsUsableEffect,
  ...runesUsableEffects,
  ...potionsUsableEffects,
};

export { usableEffectsIndex };
