import { container } from "@providers/inversify/container";
import { SkillCalculator } from "../SkillCalculator";

describe("SkillCalculator.ts", () => {
  let skillCalculator: SkillCalculator;

  beforeAll(() => {
    skillCalculator = container.get<SkillCalculator>(SkillCalculator);
  });

  it("should properly calculate all SP required for level 1, 5, 10", () => {
    const SPForLevel1 = skillCalculator.getSPForLevel(1);
    const SPForLevel5 = skillCalculator.getSPForLevel(5);
    const SPForLevel10 = skillCalculator.getSPForLevel(10);
    const SPForLevel20 = skillCalculator.getSPForLevel(20);

    expect(SPForLevel1).toBe(10);
    expect(SPForLevel5).toBe(1250);
    expect(SPForLevel10).toBe(10000);
    expect(SPForLevel20).toBe(80000);
  });

  it("should properly calculate all XP required for level 1, 5, 10", () => {
    const XPForLevel1 = skillCalculator.getXPForLevel(1);
    const XPForLevel5 = skillCalculator.getXPForLevel(5);
    const XPForLevel10 = skillCalculator.getXPForLevel(10);

    expect(XPForLevel1).toBe(5);
    expect(XPForLevel5).toBe(625);
    expect(XPForLevel10).toBe(5000);
  });
});
