import { calculateSPToNextLevel, calculateXPToNextLevel, getSPForLevel, getXPForLevel } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(SkillCalculator)
export class SkillCalculator {
  public calculateXPToNextLevel(currentXP: number, level: number): number {
    return calculateXPToNextLevel(currentXP, level);
  }

  public calculateSPToNextLevel(currentSP: number, level: number): number {
    return calculateSPToNextLevel(currentSP, level);
  }

  public getSPForLevel = (level: number): number => {
    return getSPForLevel(level);
  };

  public getXPForLevel = (level: number): number => {
    return getXPForLevel(level);
  };
}
