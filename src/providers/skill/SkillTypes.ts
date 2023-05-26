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
