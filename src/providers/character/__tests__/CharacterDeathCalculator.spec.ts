import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { container } from "@providers/inversify/container";
import { CharacterDeathCalculator } from "../CharacterDeathCalculator";

describe("CharacterDeathCalculator", () => {
  let characterDeathCalculator: CharacterDeathCalculator;

  beforeAll(() => {
    characterDeathCalculator = container.get(CharacterDeathCalculator);
  });

  describe("calculateInventoryDropChance", () => {
    it("calculates correctly the drop chances", () => {
      const dropChance7 = characterDeathCalculator.calculateInventoryDropChance({
        level: 7,
      } as unknown as ISkill);

      expect(dropChance7).toBe(5);

      const dropChance12 = characterDeathCalculator.calculateInventoryDropChance({
        level: 12,
      } as unknown as ISkill);

      expect(dropChance12).toBe(15);

      const dropChance17 = characterDeathCalculator.calculateInventoryDropChance({
        level: 17,
      } as unknown as ISkill);

      expect(dropChance17).toBe(35);
    });

    it("calculates correctly the drop chances for over max thereshold", () => {
      const dropChance = characterDeathCalculator.calculateInventoryDropChance({
        level: 50,
      } as unknown as ISkill);

      expect(dropChance).toBe(100);
      const dropChance2 = characterDeathCalculator.calculateInventoryDropChance({
        level: 32,
      } as unknown as ISkill);

      expect(dropChance2).toBe(100);
    });
  });

  describe("calculateXPLoss", () => {
    it("calculates correctly the XP loss for level 5", () => {
      const xpLoss = characterDeathCalculator.calculateSkillLoss({
        level: 5,
      } as unknown as ISkill);

      expect(xpLoss).toBe(0);
    });

    it("calculates correctly the XP loss for level 10", () => {
      const xpLoss = characterDeathCalculator.calculateSkillLoss({
        level: 10,
      } as unknown as ISkill);

      expect(xpLoss).toBe(3);
    });

    it("calculates correctly the XP loss for level 18", () => {
      const xpLoss = characterDeathCalculator.calculateSkillLoss({
        level: 18,
      } as unknown as ISkill);

      expect(xpLoss).toBe(8);
    });

    it("calculates correctly the XP loss for level 20", () => {
      const xpLoss = characterDeathCalculator.calculateSkillLoss({
        level: 20,
      } as unknown as ISkill);

      expect(xpLoss).toBe(10);
    });

    it("calculates correctly the XP loss for level 25", () => {
      const xpLoss = characterDeathCalculator.calculateSkillLoss({
        level: 25,
      } as unknown as ISkill);

      expect(xpLoss).toBe(10);
    });
  });
});
