import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { SP_INCREASE_RATIO } from "@providers/constants/SkillConstants";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SkillFunctions } from "../SkillFunctions";

describe("Case SkillFunctions", () => {
  let testCharacter: ICharacter;
  let skillFunctions: SkillFunctions;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    skillFunctions = container.get<SkillFunctions>(SkillFunctions);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasEquipment: true,
      hasSkills: true,
    });
    await testCharacter.populate("skills").execPopulate();

    await testCharacter.save();
  });

  it("calculateBonusOrPenaltiesSP should return the correct value", (done) => {
    const numberBonus = 0.1; // 10%
    const numberPenalties = -0.1; // -10%
    const expectedResult = 0.1 * SP_INCREASE_RATIO;

    const resultBonus = skillFunctions.calculateBonusOrPenaltiesSP(numberBonus);
    const resultPenalties = skillFunctions.calculateBonusOrPenaltiesSP(numberPenalties);

    expect(resultBonus).toEqual(expectedResult);
    expect(resultPenalties).toEqual(expectedResult * -1);

    done();
  });

  it("calculateBonusOrPenaltiesMagicSP should return the correct value", (done) => {
    const numberBonus = 0.1; // 10%
    const numberPenalties = -0.1; // -10%
    const expectedResult = (0.1 / 10) * 3;

    const resultBonus = skillFunctions.calculateBonusOrPenaltiesMagicSP(numberBonus);
    const resultPenalties = skillFunctions.calculateBonusOrPenaltiesMagicSP(numberPenalties);

    expect(resultBonus).toEqual(expectedResult);
    expect(resultPenalties).toEqual(expectedResult * -1);

    done();
  });

  it("should update the skill points", async () => {
    const skills = testCharacter.skills;
    const skill = (await Skill.findById(skills)) as ISkill;
    const skillType = "strength";
    const bonusOrPenalties = 10;

    const skillLevelUp = skillFunctions.updateSkillByType(skill, skillType, bonusOrPenalties);

    expect(skillLevelUp).toEqual(false);
    expect(skill[skillType].skillPoints).toEqual(bonusOrPenalties);
    expect(skill[skillType].skillPointsToNextLevel).toBe(30);
    expect(skill[skillType].level).toEqual(1);
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
