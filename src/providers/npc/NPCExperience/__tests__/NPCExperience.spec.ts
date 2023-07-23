import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MODE_EXP_MULTIPLIER } from "@providers/constants/SkillConstants";
import { container, unitTestHelper } from "@providers/inversify/container";
import { Modes, calculateXPToNextLevel } from "@rpg-engine/shared";
import { v4 as uuidv4 } from "uuid";
import { NPCExperience } from "../NPCExperience";

describe("NPCExperience.spec.ts | releaseXP test cases", () => {
  let npcExperience: NPCExperience;
  let testCharacter: ICharacter;
  let testNPC: INPC;
  let xpToLvl3: number;
  let xpToLvl4: number;
  let expToRelease: number;

  beforeAll(() => {
    npcExperience = container.get<NPCExperience>(NPCExperience);
    xpToLvl3 = calculateXPToNextLevel(0, 3);
    xpToLvl4 = calculateXPToNextLevel(0, 4);
    expToRelease = xpToLvl3 - 1;
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter({}, { hasSkills: true });

    testNPC = await unitTestHelper.createMockNPC(
      {
        xpToRelease: [
          {
            xpId: uuidv4(),
            charId: testCharacter.id,
            xp: expToRelease,
          },
        ],
      },
      { hasSkills: true }
    );

    testNPC.health = 0;
    await testNPC.save();

    await testCharacter.populate("skills").execPopulate();
    await testNPC.populate("skills").execPopulate();

    jest.useFakeTimers({
      advanceTimers: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
  });

  it("should receive the regular experience when no mode is set (soft mode)", async () => {
    await npcExperience.releaseXP(testNPC);

    const updatedSkills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    expect(updatedSkills.level).toBe(2);
    expect(updatedSkills.experience).toBe(expToRelease);
    expect(updatedSkills.xpToNextLevel).toBe(1);
    expect(testNPC.xpToRelease?.length).toBe(0);
  });

  it("should receive a experience bonus when the character is Hardcore Mode)", async () => {
    testCharacter.mode = Modes.HardcoreMode;
    await testCharacter.save();

    await npcExperience.releaseXP(testNPC);

    const updatedSkills = (await Skill.findById(testCharacter.skills).lean()) as ISkill;

    const expectedExperience = expToRelease * MODE_EXP_MULTIPLIER[Modes.HardcoreMode];
    expect(updatedSkills.level).toBe(3);
    expect(updatedSkills.experience).toBe(expectedExperience);
    expect(updatedSkills.xpToNextLevel).toBe(xpToLvl4 - expectedExperience);
    expect(testNPC.xpToRelease?.length).toBe(0);
  });
});
