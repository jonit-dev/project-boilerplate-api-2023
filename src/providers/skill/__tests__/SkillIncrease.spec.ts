import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SkillIncrease } from "../SkillIncrease";
import { calculateSPToNextLevel } from "../SkillCalculator";
import { ItemSubType } from "@rpg-engine/shared";
import { Error } from "mongoose";

type TestCase = {
  item: ItemSubType;
  skill: string;
};

const simpleTestCases: TestCase[] = [
  {
    item: ItemSubType.Sword,
    skill: "sword",
  },
  {
    item: ItemSubType.Dagger,
    skill: "dagger",
  },
  {
    item: ItemSubType.Axe,
    skill: "axe",
  },
  {
    item: ItemSubType.Bow,
    skill: "distance",
  },
  {
    item: ItemSubType.Spear,
    skill: "distance",
  },
  {
    item: ItemSubType.Shield,
    skill: "shielding",
  },
  {
    item: ItemSubType.Mace,
    skill: "club",
  },
];

describe("SkillIncrease.spec.ts", () => {
  let skillIncrease: SkillIncrease,
    testCharacter: ICharacter,
    initialSkills: ISkill,
    initialLevel: number,
    spToLvl2: number;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    skillIncrease = container.get<SkillIncrease>(SkillIncrease);
    initialSkills = new Skill({
      ownerType: "Character",
    }) as ISkill;
    initialLevel = initialSkills?.first.level;
    spToLvl2 = calculateSPToNextLevel(initialSkills?.first.skillPoints, initialLevel + 1);
    expect(spToLvl2).toBeGreaterThan(0);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter();
    await testCharacter.populate("skills").execPopulate();
  });

  it("should throw error when passing not a weapon item", async () => {
    const characterSkills = (await Skill.findById(testCharacter.skills)) as ISkill;
    try {
      skillIncrease.increaseItemSP(characterSkills, { subType: ItemSubType.Potion } as IItem);
      throw new Error("this should have failed");
    } catch (error: any | Error) {
      expect(error.message).toBe(`skill not found for item subtype ${ItemSubType.Potion}`);
    }
  });

  for (const test of simpleTestCases) {
    it(`should increase '${test.skill}' skill points | Item: ${test.item}`, async () => {
      const characterSkills = (await Skill.findById(testCharacter.skills)) as ISkill;

      expect(characterSkills[test.skill].level).toBe(initialLevel);
      expect(characterSkills[test.skill].skillPoints).toBe(0);

      for (let i = 0; i < spToLvl2; i++) {
        skillIncrease.increaseItemSP(characterSkills, { subType: test.item } as IItem);
      }

      expect(characterSkills[test.skill].level).toBe(initialLevel + 1);
      expect(characterSkills[test.skill].skillPoints).toBe(spToLvl2);

      expect(characterSkills[test.skill].skillPointsToNextLevel).toBe(
        calculateSPToNextLevel(spToLvl2, initialLevel + 2)
      );
    });
  }

  it("should increase character's 'first' skill points (SP for next level - 1)", async () => {
    for (let i = 1; i < spToLvl2; i++) {
      await skillIncrease.increaseWeaponSP(testCharacter);
    }

    const updatedSkills = await Skill.findById(testCharacter.skills);

    expect(updatedSkills?.first.level).toBe(initialLevel);
    expect(updatedSkills?.first.skillPoints).toBe(spToLvl2 - 1);
    expect(updatedSkills?.first.skillPointsToNextLevel).toBe(1);
  });

  it("should increase character's 'first' skill level and skill points (exact SP for next level)", async () => {
    // 10 Points are needed to increase skill level to level 1
    for (let i = 0; i < spToLvl2; i++) {
      await skillIncrease.increaseWeaponSP(testCharacter);
    }

    const updatedSkills = await Skill.findById(testCharacter.skills);

    expect(updatedSkills?.first.level).toBe(initialLevel + 1);
    expect(updatedSkills?.first.skillPoints).toBe(spToLvl2);
    expect(updatedSkills?.first.skillPointsToNextLevel).toBe(calculateSPToNextLevel(spToLvl2, initialLevel + 2));
  });

  it("should increase character's 'first' skill level and skill points", async () => {
    const spToAdd = spToLvl2 + 5;
    for (let i = 0; i < spToAdd; i++) {
      await skillIncrease.increaseWeaponSP(testCharacter);
    }

    const updatedSkills = await Skill.findById(testCharacter.skills);

    expect(updatedSkills?.first.level).toBe(initialLevel + 1);
    expect(updatedSkills?.first.skillPoints).toBe(spToAdd);
    expect(updatedSkills?.first.skillPointsToNextLevel).toBe(calculateSPToNextLevel(spToLvl2, initialLevel + 2) - 5);

    // Check that other skills remained unchanged
    expect(updatedSkills?.axe.level).toBe(initialSkills?.axe.level);
    expect(updatedSkills?.axe.skillPoints).toBe(initialSkills?.axe.skillPoints);
    expect(updatedSkills?.distance.level).toBe(initialSkills?.distance.level);
    expect(updatedSkills?.distance.skillPoints).toBe(initialSkills?.distance.skillPoints);
    expect(updatedSkills?.sword.level).toBe(initialSkills?.sword.level);
    expect(updatedSkills?.sword.skillPoints).toBe(initialSkills?.sword.skillPoints);
    expect(updatedSkills?.shielding.level).toBe(initialSkills?.shielding.level);
    expect(updatedSkills?.shielding.skillPoints).toBe(initialSkills?.shielding.skillPoints);
  });

  it("should increase character's 'shielding' skill level and skill points", async () => {
    for (let i = 0; i < spToLvl2; i++) {
      await skillIncrease.increaseShieldingSP(testCharacter);
    }

    const updatedSkills = await Skill.findById(testCharacter.skills);

    expect(updatedSkills?.shielding.level).toBe(initialLevel + 1);
    expect(updatedSkills?.shielding.skillPoints).toBe(spToLvl2);
    expect(updatedSkills?.shielding.skillPointsToNextLevel).toBe(calculateSPToNextLevel(spToLvl2, initialLevel + 2));

    // Check that other skills remained unchanged
    expect(updatedSkills?.axe.level).toBe(initialSkills?.axe.level);
    expect(updatedSkills?.axe.skillPoints).toBe(initialSkills?.axe.skillPoints);
    expect(updatedSkills?.distance.level).toBe(initialSkills?.distance.level);
    expect(updatedSkills?.distance.skillPoints).toBe(initialSkills?.distance.skillPoints);
    expect(updatedSkills?.sword.level).toBe(initialSkills?.sword.level);
    expect(updatedSkills?.sword.skillPoints).toBe(initialSkills?.sword.skillPoints);
    expect(updatedSkills?.first.level).toBe(initialSkills?.first.level);
    expect(updatedSkills?.first.skillPoints).toBe(initialSkills?.first.skillPoints);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
