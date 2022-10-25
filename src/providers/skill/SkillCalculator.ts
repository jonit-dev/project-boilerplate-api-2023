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

// functions exported separately because they need to be used in our skill schema, and the container is not accessible there.

export const getSPForLevel = (level: number): number => {
  const totalSPOnLevel = Math.pow(level, 3) * 5;
  return totalSPOnLevel;
};

export const getXPForLevel = (level: number): number => {
  const totalXPOnLevel = Math.pow(level, 3) * 3;
  return totalXPOnLevel;
};

export const calculateXPToNextLevel = (currentXP: number, level: number): number => {
  const xpToNextLevel = getXPForLevel(level);
  const xpToNextLevelDiff = xpToNextLevel - currentXP;

  return Math.round(xpToNextLevelDiff * 100) / 100;
};

export const calculateSPToNextLevel = (currentSP: number, level: number): number => {
  const spToNextLevel = getSPForLevel(level);
  const spToNextLevelDiff = spToNextLevel - currentSP;

  return Math.round(spToNextLevelDiff * 100) / 100;
};
