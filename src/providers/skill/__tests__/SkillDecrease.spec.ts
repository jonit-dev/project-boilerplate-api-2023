import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { container, unitTestHelper } from "@providers/inversify/container";
import { calculateSPToNextLevel, calculateXPToNextLevel } from "@rpg-engine/shared";
import { SkillDecrease } from "../SkillDecrease";

describe("SkillDecrease | Call handleCharacterDeath() to check if the death penalty is working properly", () => {
  let characterDeath: CharacterDeath;
  let testCharacter: ICharacter;
  let testNPC: INPC;
  let skillDecrease: SkillDecrease;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    characterDeath = container.get<CharacterDeath>(CharacterDeath);
    skillDecrease = container.get<SkillDecrease>(SkillDecrease);

    testNPC = await unitTestHelper.createMockNPC();
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasInventory: true,
      hasSkills: true,
    });

    await testCharacter.populate("skills").execPopulate();
  });

  describe("Character Xp", () => {
    it(" Die(1x) and check if the XP are reduced by 20%", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.experience = 49;
        skillsBeforeDeath.level = 2;
        skillsBeforeDeath.xpToNextLevel = calculateXPToNextLevel(
          skillsBeforeDeath?.experience,
          skillsBeforeDeath?.level + 1
        );

        await skillsBeforeDeath.save();
      }

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(skillsAfterDeath?.experience).toBe(39);
      expect(skillsAfterDeath?.level).toBe(2);
      expect(skillsAfterDeath?.xpToNextLevel).toBe(42);
    });

    it("Die(1x) and drop 1 lvl, XP reduced by 20%, check XpToNextLevel", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.experience = 26;
        skillsBeforeDeath.level = 2;
        skillsBeforeDeath.xpToNextLevel = calculateXPToNextLevel(
          skillsBeforeDeath?.experience,
          skillsBeforeDeath?.level + 1
        );

        await skillsBeforeDeath.save();
      }

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(skillsAfterDeath?.experience).toBe(21);
      expect(skillsAfterDeath?.level).toBe(1);
      expect(skillsAfterDeath?.xpToNextLevel).toBe(3);
    });

    it("Die(2x) and check if the XP are reduced by 40%", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.experience = 90;
        skillsBeforeDeath.level = 3;
        await skillsBeforeDeath.save();
      }

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });
      expect(skillsAfterDeath?.experience).toBe(72);
      expect(skillsAfterDeath?.level).toBe(2);
      expect(skillsAfterDeath?.xpToNextLevel).toBe(9);

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const characterSecondDeath = await Skill.findOne({ _id: testCharacter.skills });
      expect(characterSecondDeath?.experience).toBe(58);
      expect(characterSecondDeath?.level).toBe(2);
      expect(characterSecondDeath?.xpToNextLevel).toBe(23);
    });

    it("Die(10x) and check if lvl = 1 and reached XP = 2 and xpToNextLvl = 22", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.experience = 10;
        skillsBeforeDeath.level = 1;
        skillsBeforeDeath.xpToNextLevel = calculateXPToNextLevel(
          skillsBeforeDeath?.experience,
          skillsBeforeDeath?.level + 1
        );
        await skillsBeforeDeath.save();
      }

      expect(skillsBeforeDeath?.experience).toBe(10);
      expect(skillsBeforeDeath?.level).toBe(1);
      expect(skillsBeforeDeath?.xpToNextLevel).toBe(14);

      // Dies alot
      for (let i = 0; i < 10; i++) {
        await characterDeath.handleCharacterDeath(testNPC, testCharacter);
      }

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(skillsAfterDeath?.experience).toBe(2);
      expect(skillsAfterDeath?.level).toBe(1);
      expect(skillsAfterDeath?.xpToNextLevel).toBe(22);
    });

    it("Should return false to a experience < 0", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.experience = -50;
        skillsBeforeDeath.level = 2;
        skillsBeforeDeath.xpToNextLevel = calculateXPToNextLevel(skillsBeforeDeath.experience, skillsBeforeDeath.level);
        await skillsBeforeDeath.save();
      }

      // @ts-ignore
      const decreaseCharacterXp = await skillDecrease.deathPenalty(testCharacter);

      expect(decreaseCharacterXp).toBe(false);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });
      expect(skillsAfterDeath?.experience).toBe(-50);
      expect(skillsAfterDeath?.level).toBe(2);
    });
  });

  describe("Basic Attributes", () => {
    it("Die(1x) and check if the SP are reduced by 10%", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.strength.skillPoints = 91;
        skillsBeforeDeath.strength.level = 2;
        skillsBeforeDeath.strength.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.strength.skillPoints,
          skillsBeforeDeath.strength.level + 1
        );
        await skillsBeforeDeath.save();
      }

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(skillsAfterDeath?.strength.skillPoints).toBe(82);
      expect(skillsAfterDeath?.strength.level).toBe(2);
      expect(skillsAfterDeath?.strength.skillPointsToNextLevel).toBe(53);
    });

    it("[Multiples Attributes] Die(1x) and check if the SP are reduced by 10%", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.strength.skillPoints = 91;
        skillsBeforeDeath.strength.level = 2;
        skillsBeforeDeath.strength.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.strength.skillPoints,
          skillsBeforeDeath.strength.level + 1
        );

        skillsBeforeDeath.resistance.skillPoints = 75;
        skillsBeforeDeath.resistance.level = 2;
        skillsBeforeDeath.resistance.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.resistance.skillPoints,
          skillsBeforeDeath.resistance.level + 1
        );

        skillsBeforeDeath.magic.skillPoints = 66;
        skillsBeforeDeath.magic.level = 2;
        skillsBeforeDeath.magic.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.magic.skillPoints,
          skillsBeforeDeath.magic.level + 1
        );

        skillsBeforeDeath.dexterity.skillPoints = 42;
        skillsBeforeDeath.dexterity.level = 2;
        skillsBeforeDeath.dexterity.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.dexterity.skillPoints,
          skillsBeforeDeath.dexterity.level + 1
        );

        await skillsBeforeDeath.save();
      }

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(skillsAfterDeath?.strength.skillPoints).toBe(82);
      expect(skillsAfterDeath?.strength.level).toBe(2);
      expect(skillsAfterDeath?.strength.skillPointsToNextLevel).toBe(53);

      expect(skillsAfterDeath?.resistance.skillPoints).toBe(67);
      expect(skillsAfterDeath?.resistance.level).toBe(2);
      expect(skillsAfterDeath?.resistance.skillPointsToNextLevel).toBe(68);

      expect(skillsAfterDeath?.magic.skillPoints).toBe(59);
      expect(skillsAfterDeath?.magic.level).toBe(2);
      expect(skillsAfterDeath?.magic.skillPointsToNextLevel).toBe(76);

      expect(skillsAfterDeath?.dexterity.skillPoints).toBe(38);
      expect(skillsAfterDeath?.dexterity.level).toBe(1);
      expect(skillsAfterDeath?.dexterity.skillPointsToNextLevel).toBe(2);
    });

    it("Die(1x) and drop 1 lvl, XP reduced by 20%, check XpToNextLevel", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.strength.skillPoints = 138;
        skillsBeforeDeath.strength.level = 3;
        skillsBeforeDeath.strength.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.strength.skillPoints,
          skillsBeforeDeath.strength.level + 1
        );
        await skillsBeforeDeath.save();
      }

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(skillsAfterDeath?.strength.skillPoints).toBe(124);
      expect(skillsAfterDeath?.strength.level).toBe(2);
      expect(skillsAfterDeath?.strength.skillPointsToNextLevel).toBe(11);
    });

    it("Die(2x) and check if the XP are reduced by 40%", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.strength.skillPoints = 91;
        skillsBeforeDeath.strength.level = 2;
        skillsBeforeDeath.strength.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.strength.skillPoints,
          skillsBeforeDeath.strength.level + 1
        );
        await skillsBeforeDeath.save();
      }

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(skillsAfterDeath?.strength.skillPoints).toBe(82);
      expect(skillsAfterDeath?.strength.level).toBe(2);
      expect(skillsAfterDeath?.strength.skillPointsToNextLevel).toBe(53);

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const characterSecondDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(characterSecondDeath?.strength.skillPoints).toBe(74);
      expect(characterSecondDeath?.strength.level).toBe(2);
      expect(characterSecondDeath?.strength.skillPointsToNextLevel).toBe(61);
    });

    it("Die(20x) and check if lvl = 1 and reached XP = 4 and xpToNextLvl = 36", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.strength.skillPoints = 42;
        skillsBeforeDeath.strength.level = 2;
        await skillsBeforeDeath.save();
      }

      // Dies alot
      for (let i = 0; i < 20; i++) {
        await characterDeath.handleCharacterDeath(testNPC, testCharacter);
      }

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(skillsAfterDeath?.strength.skillPoints).toBe(4);
      expect(skillsAfterDeath?.strength.level).toBe(1);
      expect(skillsAfterDeath?.strength.skillPointsToNextLevel).toBe(36);
    });

    it("Should return false to a experience < 0", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.strength.skillPoints = -50;
        skillsBeforeDeath.strength.level = 2;
        skillsBeforeDeath.strength.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.strength.skillPoints,
          skillsBeforeDeath.strength.level + 1
        );
        await skillsBeforeDeath.save();
      }

      // @ts-ignore
      const decreaseCharacterXp = await skillDecrease.deathPenalty(testCharacter);

      expect(decreaseCharacterXp).toBe(false);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });
      expect(skillsAfterDeath?.strength.skillPoints).toBe(-50);
      expect(skillsAfterDeath?.strength.level).toBe(2);
      expect(skillsAfterDeath?.strength.skillPointsToNextLevel).toBe(185);
    });
  });

  describe("Combat Skills", () => {
    it("Die(1x) and check if the SP are reduced by 10%", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.sword.skillPoints = 91;
        skillsBeforeDeath.sword.level = 2;
        skillsBeforeDeath.sword.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.sword.skillPoints,
          skillsBeforeDeath.sword.level + 1
        );
        await skillsBeforeDeath.save();
      }

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(skillsAfterDeath?.sword.skillPoints).toBe(82);
      expect(skillsAfterDeath?.sword.level).toBe(2);
      expect(skillsAfterDeath?.sword.skillPointsToNextLevel).toBe(53);
    });

    it("[Multiples Attributes] Die(1x) and check if the SP are reduced by 10%", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.sword.skillPoints = 91;
        skillsBeforeDeath.sword.level = 2;
        skillsBeforeDeath.sword.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.sword.skillPoints,
          skillsBeforeDeath.sword.level + 1
        );

        skillsBeforeDeath.first.skillPoints = 75;
        skillsBeforeDeath.first.level = 2;
        skillsBeforeDeath.first.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.first.skillPoints,
          skillsBeforeDeath.first.level + 1
        );

        skillsBeforeDeath.axe.skillPoints = 66;
        skillsBeforeDeath.axe.level = 2;
        skillsBeforeDeath.axe.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.axe.skillPoints,
          skillsBeforeDeath.axe.level + 1
        );

        skillsBeforeDeath.shielding.skillPoints = 42;
        skillsBeforeDeath.shielding.level = 2;
        skillsBeforeDeath.shielding.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.shielding.skillPoints,
          skillsBeforeDeath.shielding.level + 1
        );

        await skillsBeforeDeath.save();
      }

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(skillsAfterDeath?.sword.skillPoints).toBe(82);
      expect(skillsAfterDeath?.sword.level).toBe(2);
      expect(skillsAfterDeath?.sword.skillPointsToNextLevel).toBe(53);

      expect(skillsAfterDeath?.first.skillPoints).toBe(67);
      expect(skillsAfterDeath?.first.level).toBe(2);
      expect(skillsAfterDeath?.first.skillPointsToNextLevel).toBe(68);

      expect(skillsAfterDeath?.axe.skillPoints).toBe(59);
      expect(skillsAfterDeath?.axe.level).toBe(2);
      expect(skillsAfterDeath?.axe.skillPointsToNextLevel).toBe(76);

      expect(skillsAfterDeath?.shielding.skillPoints).toBe(38);
      expect(skillsAfterDeath?.shielding.level).toBe(1);
      expect(skillsAfterDeath?.shielding.skillPointsToNextLevel).toBe(2);
    });

    it("Die(1x) and drop 1 lvl, XP reduced by 20%, check XpToNextLevel", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.dagger.skillPoints = 138;
        skillsBeforeDeath.dagger.level = 3;
        skillsBeforeDeath.dagger.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.dagger.skillPoints,
          skillsBeforeDeath.dagger.level + 1
        );
        await skillsBeforeDeath.save();
      }

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(skillsAfterDeath?.dagger.skillPoints).toBe(124);
      expect(skillsAfterDeath?.dagger.level).toBe(2);
      expect(skillsAfterDeath?.dagger.skillPointsToNextLevel).toBe(11);
    });

    it("Die(2x) and check if the XP are reduced by 40%", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.club.skillPoints = 91;
        skillsBeforeDeath.club.level = 2;
        skillsBeforeDeath.club.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.club.skillPoints,
          skillsBeforeDeath.club.level + 1
        );
        await skillsBeforeDeath.save();
      }

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(skillsAfterDeath?.club.skillPoints).toBe(82);
      expect(skillsAfterDeath?.club.level).toBe(2);
      expect(skillsAfterDeath?.club.skillPointsToNextLevel).toBe(53);

      await characterDeath.handleCharacterDeath(testNPC, testCharacter);

      const characterSecondDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(characterSecondDeath?.club.skillPoints).toBe(74);
      expect(characterSecondDeath?.club.level).toBe(2);
      expect(characterSecondDeath?.club.skillPointsToNextLevel).toBe(61);
    });

    it("Die(20x) and check if lvl = 1 and reached XP = 4 and xpToNextLvl = 36", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.axe.skillPoints = 42;
        skillsBeforeDeath.axe.level = 2;
        await skillsBeforeDeath.save();
      }

      // Dies alot
      for (let i = 0; i < 20; i++) {
        await characterDeath.handleCharacterDeath(testNPC, testCharacter);
      }

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });

      expect(skillsAfterDeath?.axe.skillPoints).toBe(4);
      expect(skillsAfterDeath?.axe.level).toBe(1);
      expect(skillsAfterDeath?.axe.skillPointsToNextLevel).toBe(36);
    });

    it("Should return false to a experience < 0", async () => {
      const skillsBeforeDeath = await Skill.findOne({ _id: testCharacter.skills });

      if (skillsBeforeDeath) {
        skillsBeforeDeath.sword.skillPoints = -50;
        skillsBeforeDeath.sword.level = 2;
        skillsBeforeDeath.sword.skillPointsToNextLevel = calculateSPToNextLevel(
          skillsBeforeDeath.sword.skillPoints,
          skillsBeforeDeath.sword.level + 1
        );
        await skillsBeforeDeath.save();
      }

      // @ts-ignore
      const decreaseCharacterXp = await skillDecrease.deathPenalty(testCharacter);

      expect(decreaseCharacterXp).toBe(false);

      const skillsAfterDeath = await Skill.findOne({ _id: testCharacter.skills });
      expect(skillsAfterDeath?.sword.skillPoints).toBe(-50);
      expect(skillsAfterDeath?.sword.level).toBe(2);
      expect(skillsAfterDeath?.sword.skillPointsToNextLevel).toBe(185);
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
