import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SkillDecrease } from "../SkillDecrease";

describe("deathPenalty", () => {
  let skillDecrease: SkillDecrease;
  let mockCharacter: ICharacter;
  const deathPenalty = jest.fn();

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);
    skillDecrease = container.get<SkillDecrease>(SkillDecrease);
    mockCharacter = await unitTestHelper.createMockCharacter(null, {
      hasSkills: true,
    });
  });

  it("should call deathPenalty", async () => {
    jest.spyOn(skillDecrease, "deathPenalty").mockImplementation(deathPenalty);
    deathPenalty.mockReturnValue(true);

    const result = await skillDecrease.deathPenalty(mockCharacter);

    expect(result).toBe(true);
    expect(deathPenalty).toBeCalledTimes(1);
    expect(deathPenalty).toBeCalledWith(mockCharacter);
    deathPenalty.mockReset();
  });

  it("should decrease character's XP by 20%", async () => {
    const skill = (await Skill.findById(mockCharacter.skills)) as ISkill;
    skill!.experience = 60;
    skill!.level = 3;
    await Skill.findByIdAndUpdate(skill._id, { ...skill });

    // @ts-ignore
    const result = await skillDecrease.deathPenalty(mockCharacter);
    const updateSkill = (await Skill.findById(mockCharacter.skills)) as ISkill;

    expect(result).toBe(true);
    expect(updateSkill.experience).toEqual(48);
    expect(updateSkill.level).toEqual(3);
  });

  it("should decrease character's strength/dextery", () => {
    const mockSkills = {
      strength: { level: 3, skillPoints: 42 },
      dexterity: { level: 3, skillPoints: 43 },
    };

    // @ts-ignore
    skillDecrease.decreaseSP(mockSkills, "strength");
    // @ts-ignore
    skillDecrease.decreaseSP(mockSkills, "dexterity");

    expect(mockSkills).toEqual({
      strength: { level: 3, skillPoints: 38, skillPointsToNextLevel: 26 },
      dexterity: { level: 3, skillPoints: 39, skillPointsToNextLevel: 25 },
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
