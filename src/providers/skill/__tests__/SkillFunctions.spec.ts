import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container, unitTestHelper } from "@providers/inversify/container";
import { BasicAttribute, CharacterBuffDurationType, CharacterBuffType, CraftingSkill } from "@rpg-engine/shared";
import { SkillFunctions } from "../SkillFunctions";

describe("SkillFunctions", () => {
  let testCharacter: ICharacter;
  let skillFunctions: SkillFunctions;

  beforeAll(() => {
    skillFunctions = container.get<SkillFunctions>(SkillFunctions);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
    });
    await testCharacter.populate("skills").execPopulate();
  });

  it("calculateBonusOrPenaltiesSP should return the correct value", async () => {
    const numberBonus = 0.1; // 10%
    const numberPenalties = -0.1; // -10%

    const fishingSkill = 2;

    await Skill.findByIdAndUpdate(testCharacter.skills, {
      fishing: {
        level: fishingSkill,
      },
    });

    const resultBonus = await skillFunctions.calculateBonusOrPenaltiesSP(
      testCharacter,
      numberBonus,
      fishingSkill,
      "fishing"
    );
    const resultPenalties = await skillFunctions.calculateBonusOrPenaltiesSP(
      testCharacter,
      numberPenalties,
      fishingSkill,
      "fishing"
    );

    expect(resultBonus).toEqual(0.44);
    expect(resultPenalties).toEqual(0.36);
  });

  it("calculateBonusOrPenaltiesMagicSP should return the correct value", async () => {
    const numberBonus = 0.1; // 10%
    const numberPenalties = -0.1; // -10%

    const magicLevel = 2;

    await Skill.findByIdAndUpdate(testCharacter.skills, {
      magic: {
        level: magicLevel,
      },
    });

    const resultBonus = await skillFunctions.calculateBonusOrPenaltiesMagicSP(
      testCharacter,
      numberBonus,
      magicLevel,
      "magic"
    );
    const resultPenalties = await skillFunctions.calculateBonusOrPenaltiesMagicSP(
      testCharacter,
      numberPenalties,
      magicLevel,
      "magic"
    );

    expect(resultBonus).toEqual(0.88);
    expect(resultPenalties).toEqual(0.72);
  });

  it("should update the skill points", async () => {
    const skill = (await Skill.findById(testCharacter.skills)) as ISkill;
    const skillType = "strength";
    const bonusOrPenalties = 10;

    const skillLevelUp = await skillFunctions.updateSkillByType(testCharacter, skill, skillType, bonusOrPenalties);

    expect(skillLevelUp).toEqual(false);
    expect(skill[skillType].skillPoints).toEqual(bonusOrPenalties);
    expect(skill[skillType].skillPointsToNextLevel).toBe(12);
    expect(skill[skillType].level).toEqual(1);
  });

  it("should calculate the bonus correctly", async () => {
    const testCases = [
      {
        skills: new Skill({
          ownerType: "Character",
          level: 1,
        }),
        exp: 0,
      },
      {
        skills: new Skill({
          ownerType: "Character",
          level: 51,
        }),
        exp: 1,
      },
      {
        skills: new Skill({
          ownerType: "Character",
          level: 101,
        }),
        exp: 2,
      },
    ];
    for (const tc of testCases) {
      const res = await tc.skills.save();
      const bonus = await skillFunctions.calculateBonus(res._id);
      expect(bonus).toEqual(tc.exp);
    }
  });

  describe("Bonus and penalties x Buff edge cases", () => {
    let characterBuffActivator: CharacterBuffActivator;

    beforeAll(() => {
      characterBuffActivator = container.get<CharacterBuffActivator>(CharacterBuffActivator);
    });

    beforeEach(async () => {
      testCharacter = await unitTestHelper.createMockCharacter(null, {
        hasEquipment: true,
        hasSkills: true,
      });
    });

    it("buffs should not impact the calculateBonusOrPenaltiesSP calculation", async () => {
      const numberBonus = 0.1; // 10%
      const numberPenalties = -0.1; // -10%

      await Skill.findByIdAndUpdate(testCharacter.skills, {
        fishing: {
          level: 2,
        },
      });

      await characterBuffActivator.enablePermanentBuff(testCharacter, {
        type: CharacterBuffType.Skill,
        trait: CraftingSkill.Fishing,
        buffPercentage: 10,
        durationType: CharacterBuffDurationType.Permanent,
      });

      const skills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

      const fishingSkill = skills.fishing.level;

      const resultBonus = await skillFunctions.calculateBonusOrPenaltiesSP(
        testCharacter,
        numberBonus,
        fishingSkill,
        "fishing"
      );
      const resultPenalties = await skillFunctions.calculateBonusOrPenaltiesSP(
        testCharacter,
        numberPenalties,
        fishingSkill,
        "fishing"
      );

      expect(resultBonus).toEqual(0.44);
      expect(resultPenalties).toEqual(0.36);
    });

    it("buffs should not impact the calculateBonusOrPenaltiesMagicSP calculation", async () => {
      const numberBonus = 0.1; // 10%
      const numberPenalties = -0.1; // -10%

      await Skill.findByIdAndUpdate(testCharacter.skills, {
        magic: {
          level: 2,
        },
      });

      await characterBuffActivator.enablePermanentBuff(testCharacter, {
        type: CharacterBuffType.Skill,
        trait: BasicAttribute.Magic,
        buffPercentage: 10,
        durationType: CharacterBuffDurationType.Permanent,
      });

      const skills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

      const resultBonus = await skillFunctions.calculateBonusOrPenaltiesMagicSP(
        testCharacter,
        numberBonus,
        skills.magic.level,
        "magic"
      );
      const resultPenalties = await skillFunctions.calculateBonusOrPenaltiesMagicSP(
        testCharacter,
        numberPenalties,
        skills.magic.level,
        "magic"
      );

      expect(resultBonus).toEqual(0.88);
      expect(resultPenalties).toEqual(0.72);
    });
  });
});
