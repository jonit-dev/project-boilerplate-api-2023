import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SkillDecrease } from "../SkillDecrease";

describe("deathPenalty", () => {
  let skillDecrease: SkillDecrease;
  let mockCharacter: ICharacter;

  const deathPenalty = jest.fn();

  function resetMocks(): void {
    deathPenalty.mockReset();
  }

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();
    skillDecrease = container.get<SkillDecrease>(SkillDecrease);
  });

  beforeEach(async () => {
    mockCharacter = await unitTestHelper.createMockCharacter(null, {
      hasSkills: true,
    });
    jest.spyOn(skillDecrease, "deathPenalty").mockImplementation(deathPenalty);
    resetMocks();
  });

  it("should call deathPenalty", async () => {
    deathPenalty.mockReturnValue(true);

    const result = await skillDecrease.deathPenalty(mockCharacter);

    expect(result).toBe(true);
    expect(deathPenalty).toBeCalledTimes(1);
    expect(deathPenalty).toBeCalledWith(mockCharacter);
  });

  it("should decrease character's XP by 20%", async () => {
    const mockFindOne = jest.fn().mockResolvedValue({ experience: 26, level: 2 });
    const mockUpdateSkills = jest.fn();
    const mockCalculateXPToNextLevel = jest.fn().mockReturnValue(60);

    jest.spyOn(Skill, "findOne").mockImplementation(mockFindOne);
    jest.spyOn(skillDecrease, "updateSkills" as any).mockImplementation(mockUpdateSkills);
    // @ts-ignore
    jest.spyOn(skillDecrease.skillCalculator, "calculateXPToNextLevel").mockImplementation(mockCalculateXPToNextLevel);
    // @ts-ignore
    const result = await skillDecrease.decreaseCharacterXp(mockCharacter);

    expect(result).toBe(true);
    expect(mockFindOne).toBeCalledWith({ _id: mockCharacter.skills });
    expect(mockUpdateSkills).toBeCalledWith({ experience: 21, level: 2, xpToNextLevel: 60 }, mockCharacter);
    expect(mockCalculateXPToNextLevel).toBeCalledWith(21, 3);
  });

  it("should decrease character's strength/dextery", () => {
    const mockSkills = {
      strength: { level: 2, skillPoints: 42 },
      dexterity: { level: 2, skillPoints: 43 },
    };

    // @ts-ignore
    skillDecrease.decreaseSP(mockSkills, "strength");
    // @ts-ignore
    skillDecrease.decreaseSP(mockSkills, "dexterity");

    expect(mockSkills).toEqual({
      strength: { level: 2, skillPoints: 38, skillPointsToNextLevel: 97 },
      dexterity: { level: 2, skillPoints: 39, skillPointsToNextLevel: 96 },
    });
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });
});
