import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import {
  BasicAttribute,
  CharacterAttributes,
  ICharacterPermanentBuff,
  ICharacterTemporaryBuff,
} from "@rpg-engine/shared";
import { CharacterBuffActivator } from "../CharacterBuffActivator";
import { CharacterBuffTracker } from "../CharacterBuffTracker";

describe("CharacterBuffActivator", () => {
  let characterBuffActivator: CharacterBuffActivator;
  let testCharacter: ICharacter;
  let characterBuffCharacterAttributeSpy: jest.SpyInstance;
  let characterBuffSkillSpy: jest.SpyInstance;
  let characterBuffTracker: CharacterBuffTracker;

  beforeAll(() => {
    characterBuffActivator = container.get(CharacterBuffActivator);
    characterBuffTracker = container.get(CharacterBuffTracker);

    jest.useFakeTimers({
      advanceTimers: true,
    });
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter(null, {
      hasSkills: true,
    });
    characterBuffCharacterAttributeSpy = jest.spyOn(
      // @ts-ignore
      characterBuffActivator.characterBuffCharacterAttribute,
      "enableBuff"
    );
    // @ts-ignore
    characterBuffSkillSpy = jest.spyOn(characterBuffActivator.characterBuffSkill, "enableBuff");
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

    const buffId = await characterBuffActivator.enableTemporaryBuff(testCharacter, buff);

    // Add assertions to check if the buff has been applied correctly

    expect(buffId).toBeDefined();

    expect(characterBuffCharacterAttributeSpy).toHaveBeenCalledTimes(1);
    expect(characterBuffCharacterAttributeSpy).toHaveBeenCalledWith(testCharacter, buff, undefined);
  });

  it("should enable a skill buff", async () => {
    const buff = {
      type: "skill",
      trait: BasicAttribute.Strength, // Replace with a valid skill trait from your implementation
      buffPercentage: 10,
      durationSeconds: 1000,
      durationType: "temporary",
    } as ICharacterTemporaryBuff;

    const buffId = await characterBuffActivator.enableTemporaryBuff(testCharacter, buff);

    expect(buffId).toBeDefined();
    expect(characterBuffSkillSpy).toHaveBeenCalledTimes(1);
    expect(characterBuffSkillSpy).toHaveBeenCalledWith(testCharacter, buff, undefined);
  });

  it("should disable a character attribute buff", async () => {
    const buff = {
      type: "characterAttribute",
      trait: CharacterAttributes.MaxHealth,
      buffPercentage: 10,
      durationType: "permanent",
    } as ICharacterPermanentBuff;

    const enabledBuff = await characterBuffActivator.enablePermanentBuff(testCharacter, buff);

    expect(characterBuffCharacterAttributeSpy).toHaveBeenCalledTimes(1);
    expect(characterBuffCharacterAttributeSpy).toHaveBeenCalledWith(testCharacter, buff, undefined);

    if (!enabledBuff) {
      throw new Error("Buff ID is undefined");
    }

    const disableResult = await characterBuffActivator.disableBuff(testCharacter, enabledBuff._id!, buff.type);

    expect(disableResult).toBeTruthy();
  });

  it("should disable a skill buff", async () => {
    const buff = {
      type: "skill",
      trait: BasicAttribute.Strength, // Replace with a valid skill trait from your implementation
      buffPercentage: 10,
      durationType: "permanent",
    } as ICharacterPermanentBuff;

    const enabledBuff = await characterBuffActivator.enablePermanentBuff(testCharacter, buff);

    if (!enabledBuff) {
      throw new Error("Buff ID is undefined");
    }

    const disableResult = await characterBuffActivator.disableBuff(testCharacter, enabledBuff._id!, buff.type);

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

    const enabledBuff = await characterBuffActivator.enableTemporaryBuff(testCharacter, buff);

    if (!enabledBuff) {
      throw new Error("Buff ID is undefined");
    }

    // Add assertions to check if the buff has been applied correctly

    expect(characterBuffCharacterAttributeSpy).toHaveBeenCalledTimes(1);
    expect(characterBuffCharacterAttributeSpy).toHaveBeenCalledWith(testCharacter, buff, undefined);

    jest.advanceTimersByTime(buff.durationSeconds * 1000);

    // Add assertions to check if the buff has been removed correctly

    const disableResult = await characterBuffActivator.disableBuff(testCharacter, enabledBuff._id!, buff.type);

    expect(disableResult).toBeTruthy();

    const buffExists = await characterBuffTracker.getBuff(testCharacter._id, enabledBuff._id!);

    expect(buffExists).toBeFalsy();
  });
});
