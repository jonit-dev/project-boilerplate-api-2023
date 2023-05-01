import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import {
  BasicAttribute,
  CharacterAttributes,
  ICharacterPermanentBuff,
  ICharacterTemporaryBuff,
} from "@rpg-engine/shared";
import { CharacterBuff } from "../CharacterBuff";

describe("CharacterBuff", () => {
  let characterBuff: CharacterBuff;
  let testCharacter: ICharacter;
  let characterBuffCharacterAttributeSpy: jest.SpyInstance;
  let characterBuffSkillSpy: jest.SpyInstance;

  beforeAll(() => {
    characterBuff = container.get(CharacterBuff);

    jest.useFakeTimers({
      advanceTimers: true,
    });
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasSkills: true,
    });
    // @ts-ignore
    characterBuffCharacterAttributeSpy = jest.spyOn(characterBuff.characterBuffCharacterAttribute, "enableBuff");
    // @ts-ignore
    characterBuffSkillSpy = jest.spyOn(characterBuff.characterBuffSkill, "enableBuff");
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should enable a character attribute buff", async () => {
    const buff = {
      type: "characterAttribute",
      trait: CharacterAttributes.MaxHealth,
      buffPercentage: 10,
      durationSeconds: 1000,
      durationType: "temporary",
    } as ICharacterTemporaryBuff;

    const buffId = await characterBuff.enableTemporaryBuff(testCharacter, buff);

    // Add assertions to check if the buff has been applied correctly

    expect(buffId).toBeDefined();

    expect(characterBuffCharacterAttributeSpy).toHaveBeenCalledTimes(1);
    expect(characterBuffCharacterAttributeSpy).toHaveBeenCalledWith(testCharacter, buff);
  });

  it("should enable a skill buff", async () => {
    const buff = {
      type: "skill",
      trait: BasicAttribute.Strength, // Replace with a valid skill trait from your implementation
      buffPercentage: 10,
      durationSeconds: 1000,
      durationType: "temporary",
    } as ICharacterTemporaryBuff;

    const buffId = await characterBuff.enableTemporaryBuff(testCharacter, buff);

    expect(buffId).toBeDefined();
    expect(characterBuffSkillSpy).toHaveBeenCalledTimes(1);
    expect(characterBuffSkillSpy).toHaveBeenCalledWith(testCharacter, buff);
  });

  it("should disable a character attribute buff", async () => {
    const buff = {
      type: "characterAttribute",
      trait: CharacterAttributes.MaxHealth,
      buffPercentage: 10,
      durationType: "permanent",
    } as ICharacterPermanentBuff;

    const buffId = await characterBuff.enablePermanentBuff(testCharacter, buff);

    expect(characterBuffCharacterAttributeSpy).toHaveBeenCalledTimes(1);
    expect(characterBuffCharacterAttributeSpy).toHaveBeenCalledWith(testCharacter, buff);

    const disableResult = await characterBuff.disableBuff(testCharacter, buffId, buff.type);

    expect(disableResult).toBeTruthy();
  });

  it("should disable a skill buff", async () => {
    const buff = {
      type: "skill",
      trait: BasicAttribute.Strength, // Replace with a valid skill trait from your implementation
      buffPercentage: 10,
      durationType: "permanent",
    } as ICharacterPermanentBuff;

    const buffId = await characterBuff.enablePermanentBuff(testCharacter, buff);

    const disableResult = await characterBuff.disableBuff(testCharacter, buffId, buff.type);

    expect(disableResult).toBeTruthy();
  });

  it("should disable a temporary buff after the duration expires", async () => {
    const buff = {
      type: "characterAttribute",
      trait: CharacterAttributes.MaxHealth,
      buffPercentage: 10,
      durationSeconds: 1000,
      durationType: "temporary",
    } as ICharacterTemporaryBuff;

    const buffId = await characterBuff.enableTemporaryBuff(testCharacter, buff);

    // Add assertions to check if the buff has been applied correctly

    expect(characterBuffCharacterAttributeSpy).toHaveBeenCalledTimes(1);
    expect(characterBuffCharacterAttributeSpy).toHaveBeenCalledWith(testCharacter, buff);

    jest.advanceTimersByTime(buff.durationSeconds * 1000);

    // Add assertions to check if the buff has been removed correctly

    const disableResult = await characterBuff.disableBuff(testCharacter, buffId, buff.type);

    expect(disableResult).toBeTruthy();
  });
});
