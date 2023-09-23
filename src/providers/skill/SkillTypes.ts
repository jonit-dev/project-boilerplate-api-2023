import { BasicAttribute, CombatSkill, CraftingSkill } from "@rpg-engine/shared";

export type SkillsAvailable = CombatSkill | CraftingSkill | BasicAttribute;

export const SKILLS_LIST = [
  "stamina",
  "magic",
  "magicResistance",
  "strength",
  "resistance",
  "dexterity",
  "first",
  "club",
  "sword",
  "axe",
  "distance",
  "shielding",
  "dagger",
  "fishing",
  "mining",
  "lumberjacking",
  "cooking",
  "alchemy",
  "blacksmithing",
];

export enum SkillTimeoutDifficulty {
  Easy = 5,
  Medium = 6,
  Hard = 8,
}
