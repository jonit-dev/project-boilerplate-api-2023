import { CharacterClass } from "@rpg-engine/shared";
import {
  IBasicAttributesBonusAndPenalties,
  ICombatSkillsBonusAndPenalties,
} from "@rpg-engine/shared/dist/types/skills.types";
import { provide } from "inversify-binding-decorators";

const dataClass = [
  {
    class: "None",
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
  },
  {
    class: "Warrior",
    basicAttributes: {
      stamina: 0.1,
      magic: 0,
      magicResistance: 0,
      strength: 0.1,
      resistance: 0,
      dexterity: 0,
    },
    combatSkills: {
      first: 0.1,
      club: 0,
      sword: 0.1,
      axe: 0,
      distance: 0,
      shielding: 0.1,
      dagger: 0,
    },
  },
  {
    class: "Berserker",
    basicAttributes: {
      stamina: 0.2,
      magic: -0.1,
      magicResistance: 0.1,
      strength: 0.2,
      resistance: 0.1,
      dexterity: -0.1,
    },
    combatSkills: {
      first: 0.2,
      club: 0.1,
      sword: 0.2,
      axe: 0.1,
      distance: -0.1,
      shielding: 0.2,
      dagger: 0.1,
    },
  },
  {
    class: "Cleric",
    basicAttributes: {
      stamina: 0.1,
      magic: -0.2,
      magicResistance: 0.2,
      strength: 0.1,
      resistance: 0.1,
      dexterity: -0.1,
    },
    combatSkills: {
      first: 0.1,
      club: 0.1,
      sword: 0.1,
      axe: 0.1,
      distance: -0.1,
      shielding: 0.1,
      dagger: 0.1,
    },
  },
  {
    class: "Sorcerer",
    basicAttributes: {
      stamina: -0.1,
      magic: 0.4,
      magicResistance: -0.1,
      strength: -0.1,
      resistance: -0.1,
      dexterity: 0.2,
    },
    combatSkills: {
      first: -0.1,
      club: -0.1,
      sword: -0.1,
      axe: -0.1,
      distance: 0.2,
      shielding: -0.1,
      dagger: -0.1,
    },
  },
  {
    class: "Rogue",
    basicAttributes: {
      stamina: 0.1,
      magic: 0,
      magicResistance: 0,
      strength: 0.1,
      resistance: 0,
      dexterity: 0.1,
    },
    combatSkills: {
      first: 0.1,
      club: 0,
      sword: 0.1,
      axe: 0,
      distance: 0,
      shielding: 0.1,
      dagger: 0,
    },
  },
  {
    class: "Hunter",
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
  },
  {
    class: "Assassin",
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
  },
];

@provide(CharacterClassBonusOrPenalties)
export class CharacterClassBonusOrPenalties {
  constructor() {}

  public getClassBonusOrPenalties(characterClass: CharacterClass): {
    basicAttributes: IBasicAttributesBonusAndPenalties;
    combatSkills: ICombatSkillsBonusAndPenalties;
  } {
    const foundClass = dataClass.find((data) => data.class === characterClass);

    if (!foundClass) {
      throw new Error(`Invalid Class: ${characterClass}`);
    }
    return {
      basicAttributes: foundClass.basicAttributes,
      combatSkills: foundClass.combatSkills,
    };
  }
}
