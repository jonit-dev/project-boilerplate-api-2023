import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { calculateXPToNextLevel } from "@rpg-engine/shared";
import { v4 as uuidv4 } from "uuid";
import { NPCExperienceLimiter } from "../NPCExperienceLimiter";

describe("NPCExperienceLimiter", () => {
  let npcExperienceLimiter: NPCExperienceLimiter;
  let testNPC: INPC;
  let xpToLvl3: number;
  let xpToLvl4: number;
  let expToRelease: number;
  let testCharacter: ICharacter;
  beforeAll(() => {
    npcExperienceLimiter = container.get<NPCExperienceLimiter>(NPCExperienceLimiter);
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
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return false if experience or xpToRelease is not defined", () => {
    testNPC.experience = undefined;
    const result = npcExperienceLimiter.isXpInRange(testNPC);
    expect(result).toBe(false);
  });

  it("should return true if total xp in xpToRelease is less than NPC's experience", () => {
    testNPC.experience = xpToLvl3;

    const result = npcExperienceLimiter.isXpInRange(testNPC);
    expect(result).toBe(true);
  });

  it("should return true if total xp in xpToRelease is equal to NPC's experience", () => {
    testNPC.experience = xpToLvl3 - 1;

    const result = npcExperienceLimiter.isXpInRange(testNPC);
    expect(result).toBe(true);
  });

  it("should return false if total xp in xpToRelease is greater than NPC's experience", () => {
    testNPC.experience = xpToLvl3 - 2;

    const result = npcExperienceLimiter.isXpInRange(testNPC);
    expect(result).toBe(false);
  });
});
