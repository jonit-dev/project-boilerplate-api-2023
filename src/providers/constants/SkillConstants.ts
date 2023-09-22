import { CharacterClass, LifeBringerRaces, Modes, ShadowWalkerRaces } from "@rpg-engine/shared";

export const DAMAGE_ATTRIBUTE_WEIGHT = 1;
export const DAMAGE_COMBAT_SKILL_WEIGHT = 1.5;

export const EXP_RATIO = 1.75;

export const SP_INCREASE_RATIO = 1;
export const SP_CRAFTING_INCREASE_RATIO = SP_INCREASE_RATIO * 25;

export const SP_MAGIC_INCREASE_TIMES_MANA = 0.17;

export const INCREASE_BONUS_FACTION = 0.1;

export const SP_INCREASE_SECONDS_COOLDOWN = 8;

export const HEALTH_MANA_BASE_INCREASE_RATE = 15;

export const ML_INCREASE_RATIO = 0.8;

export const SPELL_CALCULATOR_DEFAULT_MIN_SKILL_MULTIPLIER = 0.5;
export const SPELL_CALCULATOR_DEFAULT_MAX_SKILL_MULTIPLIER = 1.5;

export const CUSTOM_SKILL_COOLDOWNS = {
  resistance: 10,
  distance: 8,
  magic: 7,

  shielding: 10,
  first: 10,
  club: 10,
  sword: 10,
  axe: 10,
  dagger: 10,
};

export const CLASS_BONUS_OR_PENALTIES = [
  {
    class: CharacterClass.None,
    basicAttributes: {
      stamina: 0,
      magic: 0,
      magicResistance: 0,
      strength: 0,
      resistance: 0,
      dexterity: 0,
    },
    combatSkills: {
      first: 0,
      club: 0,
      sword: 0,
      axe: 0,
      distance: 0,
      shielding: 0,
      dagger: 0,
    },
    craftingSkills: {
      fishing: 0,
      mining: 0,
      lumberjacking: 0,
      cooking: 0,
      alchemy: 0,
      blacksmithing: 0,
    },
  },
  {
    class: CharacterClass.Warrior,
    basicAttributes: {
      stamina: 0.1,
      magic: -0.05,
      magicResistance: -0.1,
      strength: 0.1,
      resistance: 0.05,
      dexterity: 0,
    },
    combatSkills: {
      first: 0.05,
      club: 0.05,
      sword: 0.1,
      axe: 0.05,
      distance: -0.05,
      shielding: 0.1,
      dagger: 0,
    },
    craftingSkills: {
      fishing: 0,
      mining: 0.05,
      lumberjacking: 0.05,
      cooking: 0,
      alchemy: -0.05,
      blacksmithing: 0.1,
    },
  },
  {
    class: CharacterClass.Berserker,
    basicAttributes: {
      stamina: 0.2,
      magic: -0.1,
      magicResistance: -0.15,
      strength: 0.2,
      resistance: -0.1,
      dexterity: -0.05,
    },
    combatSkills: {
      first: 0.1,
      club: 0.2,
      sword: 0.05,
      axe: 0.2,
      distance: -0.1,
      shielding: 0.05,
      dagger: 0.1,
    },
    craftingSkills: {
      fishing: -0.05,
      mining: 0,
      lumberjacking: 0,
      cooking: -0.05,
      alchemy: -0.1,
      blacksmithing: 0,
    },
  },
  {
    class: CharacterClass.Druid,
    basicAttributes: {
      stamina: 0,
      magic: 0.2,
      magicResistance: 0.15,
      strength: -0.05,
      resistance: 0.05,
      dexterity: 0.05,
    },
    combatSkills: {
      first: -0.05,
      club: -0.05,
      sword: -0.05,
      axe: -0.05,
      distance: 0,
      shielding: 0.05,
      dagger: -0.05,
    },
    craftingSkills: {
      fishing: 0.1,
      mining: 0,
      lumberjacking: 0,
      cooking: 0.1,
      alchemy: 0.2,
      blacksmithing: 0,
    },
  },
  {
    class: CharacterClass.Sorcerer,
    basicAttributes: {
      stamina: -0.05,
      magic: 0.2,
      magicResistance: 0.2,
      strength: -0.1,
      resistance: -0.05,
      dexterity: 0.05,
    },
    combatSkills: {
      first: -0.1,
      club: -0.1,
      sword: -0.1,
      axe: -0.1,
      distance: 0.1,
      shielding: -0.1,
      dagger: -0.05,
    },
    craftingSkills: {
      fishing: 0.05,
      mining: -0.05,
      lumberjacking: -0.05,
      cooking: 0.05,
      alchemy: 0.15,
      blacksmithing: 0,
    },
  },
  {
    class: CharacterClass.Rogue,
    basicAttributes: {
      stamina: 0.05,
      magic: -0.05,
      magicResistance: 0,
      strength: 0.05,
      resistance: 0,
      dexterity: 0.1,
    },
    combatSkills: {
      first: 0,
      club: 0,
      sword: 0.05,
      axe: 0,
      distance: 0.05,
      shielding: 0.05,
      dagger: 0.1,
    },
    craftingSkills: {
      fishing: 0.05,
      mining: 0,
      lumberjacking: 0,
      cooking: 0,
      alchemy: 0.05,
      blacksmithing: 0.1,
    },
  },
  {
    class: CharacterClass.Hunter,
    basicAttributes: {
      stamina: 0.05,
      magic: 0.05,
      magicResistance: 0,
      strength: 0.05,
      resistance: 0.05,
      dexterity: 0.15,
    },
    combatSkills: {
      first: 0.1,
      club: 0.05,
      sword: 0.05,
      axe: 0.05,
      distance: 0.1,
      shielding: 0.05,
      dagger: 0.05,
    },
    craftingSkills: {
      fishing: 0.1,
      mining: 0,
      lumberjacking: 0.05,
      cooking: 0,
      alchemy: 0,
      blacksmithing: 0,
    },
  },
];

export const RACE_BONUS_OR_PENALTIES = [
  {
    race: ShadowWalkerRaces.Human,
    basicAttributes: {
      stamina: 0,
      magic: 0,
      magicResistance: 0,
      strength: 0,
      resistance: 0,
      dexterity: 0,
    },
    combatSkills: {
      first: 0,
      club: 0,
      sword: 0,
      axe: 0,
      distance: 0,
      shielding: 0,
      dagger: 0,
    },
    craftingSkills: {
      fishing: 0,
      mining: 0,
      lumberjacking: 0,
      cooking: 0,
      alchemy: 0,
      blacksmithing: 0,
    },
  },
  {
    race: ShadowWalkerRaces.Minotaur,
    basicAttributes: {
      stamina: 0.2,
      magic: -0.2,
      magicResistance: 0.2,
      strength: 0.1,
      resistance: 0.2,
      dexterity: -0.2,
    },
    combatSkills: {
      first: 0.1,
      club: 0.2,
      sword: 0.1,
      axe: 0.2,
      distance: -0.2,
      shielding: 0.1,
      dagger: 0.1,
    },
    craftingSkills: {
      fishing: -0.2,
      mining: 0.1,
      lumberjacking: 0.1,
      cooking: -0.1,
      alchemy: -0.2,
      blacksmithing: 0,
    },
  },
  {
    race: ShadowWalkerRaces.Orc,
    basicAttributes: {
      stamina: 0.1,
      magic: -0.1,
      magicResistance: 0.1,
      strength: 0.1,
      resistance: 0.1,
      dexterity: -0.05,
    },
    combatSkills: {
      first: 0.05,
      club: 0.1,
      sword: 0.05,
      axe: 0.1,
      distance: -0.1,
      shielding: 0.05,
      dagger: 0.05,
    },
    craftingSkills: {
      fishing: -0.1,
      mining: 0.1,
      lumberjacking: 0.05,
      cooking: -0.05,
      alchemy: -0.1,
      blacksmithing: 0.1,
    },
  },
  {
    race: ShadowWalkerRaces.Human,
    basicAttributes: {
      stamina: 0,
      magic: 0,
      magicResistance: 0,
      strength: 0,
      resistance: 0,
      dexterity: 0,
    },
    combatSkills: {
      first: 0,
      club: 0,
      sword: 0,
      axe: 0,
      distance: 0,
      shielding: 0,
      dagger: 0,
    },
    craftingSkills: {
      fishing: 0,
      mining: 0,
      lumberjacking: 0,
      cooking: 0,
      alchemy: 0,
      blacksmithing: 0,
    },
  },
  {
    race: LifeBringerRaces.Human,
    basicAttributes: {
      stamina: 0,
      magic: 0,
      magicResistance: 0,
      strength: 0,
      resistance: 0,
      dexterity: 0,
    },
    combatSkills: {
      first: 0,
      club: 0,
      sword: 0,
      axe: 0,
      distance: 0,
      shielding: 0,
      dagger: 0,
    },
    craftingSkills: {
      fishing: 0,
      mining: 0,
      lumberjacking: 0,
      cooking: 0,
      alchemy: 0,
      blacksmithing: 0,
    },
  },
  {
    race: LifeBringerRaces.Dwarf,
    basicAttributes: {
      stamina: 0.1,
      magic: -0.1,
      magicResistance: 0.2,
      strength: 0.2,
      resistance: 0.2,
      dexterity: -0.1,
    },
    combatSkills: {
      first: 0.1,
      club: 0.2,
      sword: 0.1,
      axe: 0.2,
      distance: -0.1,
      shielding: 0.1,
      dagger: 0.1,
    },
    craftingSkills: {
      fishing: 0.1,
      mining: 0.2,
      lumberjacking: 0.2,
      cooking: 0.1,
      alchemy: 0.1,
      blacksmithing: 0.2,
    },
  },
  {
    race: LifeBringerRaces.Elf,
    basicAttributes: {
      stamina: -0.1,
      magic: 0.1,
      magicResistance: 0.1,
      strength: 0.05,
      resistance: -0.1,
      dexterity: 0.1,
    },
    combatSkills: {
      first: 0.1,
      club: -0.1,
      sword: 0.1,
      axe: -0.1,
      distance: 0.2,
      shielding: 0.1,
      dagger: 0.1,
    },
    craftingSkills: {
      fishing: 0.2,
      mining: -0.1,
      lumberjacking: -0.1,
      cooking: 0.1,
      alchemy: 0.1,
      blacksmithing: 0,
    },
  },
  {
    race: LifeBringerRaces.Human,
    basicAttributes: {
      stamina: 0,
      magic: 0,
      magicResistance: 0,
      strength: 0,
      resistance: 0,
      dexterity: 0,
    },
    combatSkills: {
      first: 0,
      club: 0,
      sword: 0,
      axe: 0,
      distance: 0,
      shielding: 0,
      dagger: 0,
    },
    craftingSkills: {
      fishing: 0,
      mining: 0,
      lumberjacking: 0,
      cooking: 0,
      alchemy: 0,
      blacksmithing: 0,
    },
  },
];

// Mode
export const MODE_EXP_MULTIPLIER: { [key in Modes]: number } = {
  [Modes.SoftMode]: 0.8,
  [Modes.HardcoreMode]: 1.35,
  [Modes.PermadeathMode]: 1.8,
};
