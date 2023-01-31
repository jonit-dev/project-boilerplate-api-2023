import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SkillFunctions } from "../SkillFunctions";

describe("Case SkillFunctions", () => {
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

  it("calculateBonusOrPenaltiesSP should return the correct value", (done) => {
    const numberBonus = 0.1; // 10%
    const numberPenalties = -0.1; // -10%

    const resultBonus = skillFunctions.calculateBonusOrPenaltiesSP(numberBonus, 2);
    const resultPenalties = skillFunctions.calculateBonusOrPenaltiesSP(numberPenalties, 2);

    expect(resultBonus).toEqual(0.44);
    expect(resultPenalties).toEqual(0.36);

    done();
  });

  it("calculateBonusOrPenaltiesMagicSP should return the correct value", (done) => {
    const numberBonus = 0.1; // 10%
    const numberPenalties = -0.1; // -10%

    const resultBonus = skillFunctions.calculateBonusOrPenaltiesMagicSP(numberBonus, 2);
    const resultPenalties = skillFunctions.calculateBonusOrPenaltiesMagicSP(numberPenalties, 2);

    expect(resultBonus).toEqual(0.88);
    expect(resultPenalties).toEqual(0.72);

    done();
  });

  it("should update the skill points", async () => {
    const skills = testCharacter.skills;
    const skill = (await Skill.findById(skills)) as ISkill;
    const skillType = "strength";
    const bonusOrPenalties = 10;

    const skillLevelUp = skillFunctions.updateSkillByType(skill, skillType, bonusOrPenalties);

    expect(skillLevelUp).toEqual(true);
    expect(skill[skillType].skillPoints).toEqual(bonusOrPenalties);
    expect(skill[skillType].skillPointsToNextLevel).toBe(17);
    expect(skill[skillType].level).toEqual(2);
  });
});
