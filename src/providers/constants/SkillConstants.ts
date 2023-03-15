import { CharacterClass } from "@rpg-engine/shared";

export const EXP_RATIO = 1.5;

export const SP_INCREASE_RATIO = 0.7;
export const SP_CRAFTING_INCREASE_RATIO = SP_INCREASE_RATIO * 5;

export const SP_MAGIC_INCREASE_TIMES_MANA = 0.15;

export const INCREASE_BONUS_FACTION = 0.1;

export const SP_INCREASE_SECONDS_COOLDOWN = 8;

export const CUSTOM_SKILL_COOLDOWNS = {
  shielding: 14,
  resistance: 10,
  distance: 3,
  magic: 5,
  fishing: 5,

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
      stamina: 0.3,
      magic: -0.2,
      magicResistance: -0.2,
      strength: 0.2,
      resistance: 0.1,
      dexterity: -0.1,
    },
    combatSkills: {
      first: 0,
      club: 0.2,
      sword: 0.2,
      axe: 0.2,
      distance: -0.2,
      shielding: 0,
      dagger: -0.1,
    },
    craftingSkills: {
      fishing: 0,
      mining: 0,
      lumberjacking: 0.2,
      cooking: 0,
      alchemy: 0,
      blacksmithing: 0,
    },
  },
  {
    class: CharacterClass.Berserker,
    basicAttributes: {
      stamina: 0.3,
      magic: -0.3,
      magicResistance: -0.3,
      strength: 0.4,
      resistance: 0.3,
      dexterity: 0.2,
    },
    combatSkills: {
      first: 0,
      club: 0.1,
      sword: 0.1,
      axe: 0.3,
      distance: -0.3,
      shielding: 0,
      dagger: -0.3,
    },
    craftingSkills: {
      fishing: -0.1,
      mining: 0.2,
      lumberjacking: 0.2,
      cooking: -0.1,
      alchemy: 0.2,
      blacksmithing: 0,
    },
  },
  {
    class: CharacterClass.Druid,
    basicAttributes: {
      stamina: 0.1,
      magic: 0.3,
      magicResistance: 0.3,
      strength: -0.2,
      resistance: -0.2,
      dexterity: -0.1,
    },
    combatSkills: {
      first: 0,
      club: 0.2,
      sword: 0,
      axe: 0,
      distance: -0.1,
      shielding: 0,
      dagger: 0.2,
    },
    craftingSkills: {
      fishing: 0.2,
      mining: 0,
      lumberjacking: 0.1,
      cooking: 0.2,
      alchemy: 0.2,
      blacksmithing: 0,
    },
  },
  {
    class: CharacterClass.Sorcerer,
    basicAttributes: {
      stamina: -0.1,
      magic: 0.4,
      magicResistance: 0.3,
      strength: -0.3,
      resistance: -0.2,
      dexterity: 0,
    },
    combatSkills: {
      first: -0.1,
      club: -0.1,
      sword: -0.1,
      axe: -0.1,
      distance: 0.3,
      shielding: -0.1,
      dagger: -0.1,
    },
    craftingSkills: {
      fishing: -0.1,
      mining: -0.1,
      lumberjacking: 0,
      cooking: 0.1,
      alchemy: 0.2,
      blacksmithing: 0,
    },
  },
  {
    class: CharacterClass.Rogue,
    basicAttributes: {
      stamina: 0.1,
      magic: 0,
      magicResistance: 0.1,
      strength: -0.2,
      resistance: -0.2,
      dexterity: 0.4,
    },
    combatSkills: {
      first: 0,
      club: 0,
      sword: 0.1,
      axe: 0,
      distance: 0.2,
      shielding: -0.1,
      dagger: 0.4,
    },
    craftingSkills: {
      fishing: 0.4,
      mining: 0,
      lumberjacking: 0.1,
      cooking: 0,
      alchemy: 0,
      blacksmithing: 0.1,
    },
  },
  {
    class: CharacterClass.Hunter,
    basicAttributes: {
      stamina: 0,
      magic: 0,
      magicResistance: 0.2,
      strength: 0.1,
      resistance: 0.2,
      dexterity: 0.3,
    },
    combatSkills: {
      first: 0,
      club: 0,
      sword: -0.1,
      axe: -0.1,
      distance: 0.3,
      shielding: 0.3,
      dagger: 0.3,
    },
    craftingSkills: {
      fishing: 0,
      mining: 0.1,
      lumberjacking: 0.4,
      cooking: 0.1,
      alchemy: 0,
      blacksmithing: 0.2,
    },
  },
];
