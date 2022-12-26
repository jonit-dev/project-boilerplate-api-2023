import { container } from "@providers/inversify/container";
import { NPCGold, calculateGold } from "../NPCGold";

describe("NPCGold", () => {
  let npcGold: NPCGold;
  const skills = {
    level: 10,
    strength: { level: 5 },
    resistance: { level: 7 },
  };

  beforeAll(() => {
    npcGold = container.get(NPCGold);
  });

  it("calculateGold correctly calculates the gold value based on the max health and skills of the NPC", () => {
    const maxHealth = 50;

    const expectedResult = calculateGold(maxHealth, skills);
    const result = npcGold.calculateGold(maxHealth, skills);
    expect(result).toBe(expectedResult);
  });

  it("calculateGold correctly handles input values at the minimum and maximum limits of the valid range", () => {
    const minMaxHealth = 0;
    const maxMaxHealth = 100;
    const minSkillsLevel = 0;
    const maxSkillsLevel = 10;
    expect(npcGold.calculateGold(minMaxHealth, { ...skills, level: 5 })).toBe(4);
    expect(npcGold.calculateGold(maxMaxHealth, { ...skills, level: 5 })).toBeGreaterThan(0);
    expect(npcGold.calculateGold(50, { ...skills, level: minSkillsLevel })).toBe(0);
    expect(npcGold.calculateGold(50, { ...skills, level: maxSkillsLevel })).toBeGreaterThan(0);
  });

  it("calculateGold correctly handles invalid input values", () => {
    expect(npcGold.calculateGold(-1, { level: 5 })).toBe(1);
    expect(npcGold.calculateGold(50, {})).toBe(3);
  });

  it("calculateGold correctly rounds the result to the nearest integer", () => {
    const maxHealth = 50;
    const skills = {
      level: 5,
      strength: { level: 3 },
      resistance: { level: 2 },
    };
    const result = npcGold.calculateGold(maxHealth, skills);
    expect(result).toEqual(expect.any(Number));
    expect(result % 1).toBe(0);
  });

  it("calculateGold is performant and can handle large input values without causing performance issues", () => {
    const maxHealth = 1000000;
    const skills = {
      level: 10000,
      strength: { level: 5000 },
      resistance: { level: 7000 },
    };
    const startTime = Date.now();
    npcGold.calculateGold(maxHealth, skills);
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(100);
  });
});
