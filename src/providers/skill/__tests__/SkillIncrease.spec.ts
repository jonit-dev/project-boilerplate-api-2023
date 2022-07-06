import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ItemSubType } from "@rpg-engine/shared";
import { Error } from "mongoose";
import { calculateSPToNextLevel, calculateXPToNextLevel } from "../SkillCalculator";
import { SkillIncrease } from "../SkillIncrease";

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
    testNPC: INPC,
    initialSkills: ISkill,
    initialLevel: number,
    spToLvl2: number,
    xpToLvl2: number,
    sendSkillLevelUpEvents: any,
    sendExpLevelUpEvents: any;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    skillIncrease = container.get<SkillIncrease>(SkillIncrease);
    initialSkills = new Skill({
      ownerType: "Character",
    }) as ISkill;
    await initialSkills.save();
    initialLevel = initialSkills?.first.level;

    spToLvl2 = calculateSPToNextLevel(initialSkills?.first.skillPoints, initialLevel + 1);
    xpToLvl2 = calculateXPToNextLevel(initialSkills.experience, initialSkills.level + 1);

    expect(spToLvl2).toBeGreaterThan(0);
    expect(xpToLvl2).toBeGreaterThan(0);

    sendSkillLevelUpEvents = jest.spyOn(skillIncrease, "sendSkillLevelUpEvents" as any);
    sendExpLevelUpEvents = jest.spyOn(skillIncrease, "sendExpLevelUpEvents" as any);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await unitTestHelper.createMockCharacter();
    await testCharacter.populate("skills").execPopulate();

    testNPC = await unitTestHelper.createMockNPC();
    await testNPC.populate("skills").execPopulate();
  });

  it("should throw error when passing not a weapon item", async () => {
    const characterSkills = (await Skill.findById(testCharacter.skills)) as ISkill;
    try {
      // @ts-ignore
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

      // @ts-ignore
      let increasedSkills;
      for (let i = 0; i < spToLvl2; i++) {
        // @ts-ignore
        increasedSkills = skillIncrease.increaseItemSP(characterSkills, { subType: test.item } as IItem);
      }

      expect(increasedSkills.skillLevelUp).toBe(true);
      expect(increasedSkills.skillName).toBe(test.skill);
      expect(increasedSkills.skillLevel).toBe(initialLevel + 1);

      expect(characterSkills[test.skill].level).toBe(initialLevel + 1);
      expect(characterSkills[test.skill].skillPoints).toBe(spToLvl2);

      expect(characterSkills[test.skill].skillPointsToNextLevel).toBe(
        calculateSPToNextLevel(spToLvl2, initialLevel + 2)
      );
    });
  }

  it("should not increase character's 'shielding' skill | Character without Shield", async () => {
    for (let i = 0; i < spToLvl2; i++) {
      await skillIncrease.increaseShieldingSP(testCharacter);
    }

    const updatedSkills = await Skill.findById(testCharacter.skills);

    // Check that skills remained unchanged
    expect(updatedSkills?.shielding.level).toBe(initialLevel);
    expect(updatedSkills?.shielding.skillPoints).toBe(initialSkills?.shielding.skillPoints);
    expect(updatedSkills?.shielding.skillPointsToNextLevel).toBe(spToLvl2);
    expect(updatedSkills?.axe.level).toBe(initialLevel);
    expect(updatedSkills?.axe.skillPoints).toBe(initialSkills?.axe.skillPoints);
    expect(updatedSkills?.distance.level).toBe(initialLevel);
    expect(updatedSkills?.distance.skillPoints).toBe(initialSkills?.distance.skillPoints);
    expect(updatedSkills?.sword.level).toBe(initialLevel);
    expect(updatedSkills?.sword.skillPoints).toBe(initialSkills?.sword.skillPoints);
    expect(updatedSkills?.first.level).toBe(initialLevel);
    expect(updatedSkills?.first.skillPoints).toBe(initialSkills?.first.skillPoints);

    expect(sendSkillLevelUpEvents).not.toHaveBeenCalled();
    expect(sendExpLevelUpEvents).not.toHaveBeenCalled();
  });

  it("should increase character's 'first' skill points (SP for next level - 1) and should not increase xp (damage 0)", async () => {
    for (let i = 1; i < spToLvl2; i++) {
      await skillIncrease.increaseSkillsOnBattle(testCharacter, testNPC, 0);
    }
    expect(testNPC.xpToRelease?.length).toBe(0);

    await skillIncrease.releaseXP(testNPC);

    const updatedSkills = await Skill.findById(testCharacter.skills);

    expect(updatedSkills?.first.level).toBe(initialLevel);
    expect(updatedSkills?.first.skillPoints).toBe(spToLvl2 - 1);
    expect(updatedSkills?.first.skillPointsToNextLevel).toBe(1);
    expect(updatedSkills?.level).toBe(initialLevel);
    expect(updatedSkills?.experience).toBe(initialSkills.experience);
    expect(updatedSkills?.xpToNextLevel).toBe(xpToLvl2);
    expect(testNPC.xpToRelease?.length).toBe(0);

    expect(sendSkillLevelUpEvents).not.toHaveBeenCalled();
    expect(sendExpLevelUpEvents).not.toHaveBeenCalled();
  });

  it("should increase character's 'first' skill level and skill points (exact SP for next level). Should increase experience and level up", async () => {
    // increase skill level to level 2 and xp level to level 2
    for (let i = 0; i < spToLvl2; i++) {
      await skillIncrease.increaseSkillsOnBattle(testCharacter, testNPC, 1);
    }

    let updatedSkills = await Skill.findById(testCharacter.skills);

    expect(updatedSkills?.first.level).toBe(initialLevel + 1);
    expect(updatedSkills?.first.skillPoints).toBe(spToLvl2);
    expect(updatedSkills?.first.skillPointsToNextLevel).toBe(calculateSPToNextLevel(spToLvl2, initialLevel + 2));

    // Before releasing the XP, experience values should be same as initial values
    // and NPC's xpToRelease array should have a length == 1
    expect(updatedSkills?.level).toBe(initialLevel);
    expect(updatedSkills?.experience).toBe(initialSkills.experience);
    expect(updatedSkills?.xpToNextLevel).toBe(calculateXPToNextLevel(initialSkills.experience, initialLevel + 1));
    expect(testNPC.xpToRelease?.length).toBe(1);

    // Release XP
    await skillIncrease.releaseXP(testNPC);
    updatedSkills = await Skill.findById(testCharacter.skills);

    expect(updatedSkills?.level).toBe(initialLevel + 1);
    expect(updatedSkills?.experience).toBe(spToLvl2);
    expect(updatedSkills?.xpToNextLevel).toBe(calculateXPToNextLevel(updatedSkills?.experience!, initialLevel + 2));
    expect(testNPC.xpToRelease?.length).toBe(0);

    expect(sendSkillLevelUpEvents).toHaveBeenCalled();
    expect(sendExpLevelUpEvents).toHaveBeenCalled();
  });

  it("should increase character's 'first' skill level and skill points. Should increase experience and level up to level 3", async () => {
    const spToAdd = spToLvl2 + 5;

    for (let i = 0; i < spToAdd; i++) {
      await skillIncrease.increaseSkillsOnBattle(testCharacter, testNPC, 2);
    }

    let updatedSkills = await Skill.findById(testCharacter.skills);

    expect(updatedSkills?.first.level).toBe(initialLevel + 1);
    expect(updatedSkills?.first.skillPoints).toBe(spToAdd);
    expect(updatedSkills?.first.skillPointsToNextLevel).toBe(calculateSPToNextLevel(spToLvl2, initialLevel + 2) - 5);

    // Before releasing the XP, experience values should be same as initial values
    expect(updatedSkills?.level).toBe(initialLevel);
    expect(updatedSkills?.experience).toBe(initialSkills.experience);
    expect(updatedSkills?.xpToNextLevel).toBe(calculateXPToNextLevel(initialSkills.experience, initialLevel + 1));
    expect(testNPC.xpToRelease?.length).toBe(1);

    // Release XP
    await skillIncrease.releaseXP(testNPC);
    updatedSkills = await Skill.findById(testCharacter.skills);

    expect(updatedSkills?.level).toBe(initialLevel + 2);
    expect(updatedSkills?.experience).toBe(spToAdd * 2);
    expect(updatedSkills?.xpToNextLevel).toBe(calculateXPToNextLevel(updatedSkills?.experience!, initialLevel + 3));
    expect(testNPC.xpToRelease?.length).toBe(0);

    expect(sendSkillLevelUpEvents).toBeCalledTimes(2);
    expect(sendExpLevelUpEvents).toBeCalledTimes(2);

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

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
