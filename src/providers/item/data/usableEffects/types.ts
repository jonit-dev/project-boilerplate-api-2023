import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";

export interface IUsableEffect {
  key: UsableEffectsBlueprint;
  usableEffect: (character: ICharacter) => void;
  usableEffectDescription: string;
}
export interface IUsableEffectRune {
  key: UsableEffectsBlueprint;
  usableEffect: (caster: ICharacter, target: ICharacter | INPC) => void;
  usableEntityEffect?: (caster: ICharacter, target: ICharacter | INPC) => void;
  usableEffectDescription: string;
}

export enum UsableEffectsBlueprint {
  MinorEatingEffect = "MinorEatingEffect",
  ModerateEatingEffect = "ModerateEatingEffect",
  StrongEatingEffect = "StrongEatingEffect",
  SuperStrongEatingEffect = "SuperStrongEatingEffect",
  PoisonEatingEffect = "PoisonEatingEffect",
  ClearBleedingUsableEffect = "ClearBleedingUsableEffect",

  // Runes
  CorruptionRuneUsableEffect = "CorruptionRuneUsableEffect",
  DarkRuneUsableEffect = "DarkRuneUsableEffect",
  EnergyBoltRuneUsableEffect = "EnergyBoltRuneUsableEffect",
  FireBoltRuneUsableEffect = "FireBoltRuneUsableEffect",
  FireRuneUsableEffect = "FireRuneUsableEffect",
  HealRuneUsableEffect = "HealRuneUsableEffect",
  PoisonRuneUsableEffect = "PoisonRuneUsableEffect",
  ThunderRuneUsableEffect = "ThunderRuneUsableEffect",

  // Potions
  LightPoisonVialUsableEffect = "LightPoisonVialUsableEffect",
  ModeratePoisonVialUsableEffect = "ModeratePoisonVialUsableEffect",
  StrongPoisonVialUsableEffect = "StrongPoisonVialUsableEffect",

  LightBurningVialsUsableEffect = "LightBurningVialsUsableEffect",
  ModerateBurningVialsUsableEffect = "ModerateBurningVialsUsableEffect",
  StrongBurningVialsUsableEffect = "StrongBurningVialsUsableEffect",

  LightLifePotionUsableEffect = "LightLifePotionUsableEffect",
  LifePotionUsableEffect = "LifePotionUsableEffect",
  GreaterLifePotionUsableEffect = "GreaterLifePotionUsableEffect",

  LightManaPotionUsableEffect = "LightManaPotionUsableEffect",
  ManaPotionUsableEffect = "ManaPotionUsableEffect",
  GreaterManaPotionUsableEffect = "GreaterManaPotionUsableEffect",

  AntidotePotionUsableEffect = "AntidotePotionUsableEffect",
  LightEndurancePotionUsableEffect = "LightEndurancePotionUsableEffect",
}
