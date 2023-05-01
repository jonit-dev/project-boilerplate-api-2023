import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CombatSkill } from "@rpg-engine/shared";
import { ICharacterTemporaryBuff } from "../CharacterBuff";
import { CharacterBuffSkill } from "../CharacterBuffSkill";

describe("CharacterBuffSkill", () => {
  let characterBuffSkill: CharacterBuffSkill;
  let testCharacter: ICharacter;

  beforeAll(() => {
    characterBuffSkill = container.get<CharacterBuffSkill>(CharacterBuffSkill);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasSkills: true,
    });
  });

  it("enableBuff successfully applies the buff to the character", async () => {
    const buff: ICharacterTemporaryBuff = {
      type: "skill",
      trait: CombatSkill.Distance,
      buffPercentage: 10,
      durationSeconds: 60,
      durationType: "temporary",
    };

    const buffId = await characterBuffSkill.enableBuff(testCharacter, buff);
    expect(buffId).toBeDefined();
  });

  it("disableBuff successfully removes the buff from the character", async () => {
    const buff: ICharacterTemporaryBuff = {
      type: "skill",
      trait: CombatSkill.Distance,
      buffPercentage: 10,
      durationSeconds: 60,
      durationType: "temporary",
    };

    const buffId = await characterBuffSkill.enableBuff(testCharacter, buff);
    const result = await characterBuffSkill.disableBuff(testCharacter, buffId);
    expect(result).toBeTruthy();
  });

  it("disableBuff should return false if the buff is not found", async () => {
    const nonExistentBuffId = "12345678-1234-1234-1234-123456789012";
    const result = await characterBuffSkill.disableBuff(testCharacter, nonExistentBuffId);
    expect(result).toBeFalsy();
  });
});
