import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import {
  LOOT_GOLD_MAX_HEALTH_WEIGHT,
  LOOT_GOLD_RATIO,
  LOOT_GOLD_RESISTANCE_WEIGHT,
  LOOT_GOLD_SKILLS_WEIGHT,
  LOOT_GOLD_STRENGTH_WEIGHT,
} from "@providers/constants/LootConstants";
import { provide } from "inversify-binding-decorators";

@provide(NPCGold)
export class NPCGold {
  public calculateGold(maxHealth: number, skills: Partial<ISkill>): number {
    return calculateGold(maxHealth, skills);
  }
}

export const calculateGold = (maxHealth: number, skills: Partial<ISkill>): number => {
  // If any required property is not initialized, set it at least to 1
  const level = skills.level ?? 1;
  const strength = skills.strength?.level ?? 1;
  const resistance = skills.resistance?.level ?? 1;

  if (!level || !strength || !resistance) return 0;

  const total =
    maxHealth * LOOT_GOLD_MAX_HEALTH_WEIGHT +
    level * LOOT_GOLD_SKILLS_WEIGHT +
    strength * LOOT_GOLD_STRENGTH_WEIGHT +
    resistance * LOOT_GOLD_RESISTANCE_WEIGHT;

  return Math.floor((total * LOOT_GOLD_RATIO) / 5);
};
