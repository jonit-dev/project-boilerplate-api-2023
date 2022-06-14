import { provide } from "inversify-binding-decorators";

@provide(SkillCalculator)
export class SkillCalculator {
  public calculateXPToNextLevel(currentXP: number, level: number): number {
    return calculateXPToNextLevel(currentXP, level);
  }

  public calculateSPToNextLevel(currentSP: number, level: number): number {
    return calculateSPToNextLevel(currentSP, level);
  }
}

// functions exported separately because they need to be used in our skill schema, and the container is not accessible there.

export const calculateXPToNextLevel = (currentXP: number, level: number): number => {
  const xpToNextLevel = Math.pow(level, 3) * 30;
  const xpToNextLevelDiff = xpToNextLevel - currentXP;

  return xpToNextLevelDiff;
};

export const calculateSPToNextLevel = (currentSP: number, level: number): number => {
  const spToNextLevel = Math.pow(level, 3) * 60;
  const spToNextLevelDiff = spToNextLevel - currentSP;

  return spToNextLevelDiff;
};
