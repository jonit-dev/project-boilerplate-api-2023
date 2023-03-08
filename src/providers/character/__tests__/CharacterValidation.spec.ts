/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterSocketEvents } from "@rpg-engine/shared";
import { CharacterValidation } from "../CharacterValidation";

describe("CharacterValidation.ts", () => {
  let characterValidation: CharacterValidation;
  let testCharacter: ICharacter;
  let sendGenericErrorMessage: jest.SpyInstance;

  beforeAll(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();
    characterValidation = container.get<CharacterValidation>(CharacterValidation);
  });

  beforeEach(async () => {
    // @ts-ignore
    sendGenericErrorMessage = jest.spyOn(characterValidation.socketMessaging, "sendEventToUser");
    testCharacter = await unitTestHelper.createMockCharacter();
  });

  it("should throw an error if the character is banned", async () => {
    testCharacter.isBanned = true;
    await testCharacter.save();

    const result = characterValidation.hasBasicValidation(testCharacter);

    expect(result).toBe(false);
    expect(sendGenericErrorMessage).toBeCalled();
    expect(sendGenericErrorMessage).toBeCalledWith(
      testCharacter.channelId!,
      CharacterSocketEvents.CharacterForceDisconnect,
      {
        reason: "You cannot use this character while banned.",
      }
    );
  });

  it("should throw a custom error if the character is banned", async () => {
    testCharacter.isBanned = true;
    await testCharacter.save();

    const customBannedMsg = "Sorry, your target is banned.";
    const result = characterValidation.hasBasicValidation(testCharacter, new Map([["banned", customBannedMsg]]));

    expect(result).toBe(false);
    expect(sendGenericErrorMessage).toBeCalled();
    expect(sendGenericErrorMessage).toBeCalledWith(
      testCharacter.channelId!,
      CharacterSocketEvents.CharacterForceDisconnect,
      {
        reason: customBannedMsg,
      }
    );
  });

  it("should throw an error if character is dead", async () => {
    testCharacter.health = 0;
    await testCharacter.save();

    const result = characterValidation.hasBasicValidation(testCharacter);

    expect(result).toBe(false);
    expect(sendGenericErrorMessage).toBeCalled();
    expect(sendGenericErrorMessage).toBeCalledWith(
      testCharacter.channelId!,
      CharacterSocketEvents.CharacterForceDisconnect,
      {
        reason: "Sorry, you are dead.",
      }
    );
  });

  it("should throw a custom error if character is dead", async () => {
    testCharacter.health = 0;
    await testCharacter.save();

    const customDeadMsg = "Sorry, your target is dead.";
    const result = characterValidation.hasBasicValidation(testCharacter, new Map([["not-alive", customDeadMsg]]));

    expect(result).toBe(false);
    expect(sendGenericErrorMessage).toBeCalled();
    expect(sendGenericErrorMessage).toBeCalledWith(
      testCharacter.channelId!,
      CharacterSocketEvents.CharacterForceDisconnect,
      {
        reason: customDeadMsg,
      }
    );
  });

  it("should throw an error if character is offline", async () => {
    testCharacter.isOnline = false;
    await testCharacter.save();

    const result = characterValidation.hasBasicValidation(testCharacter);

    expect(result).toBe(false);
    expect(sendGenericErrorMessage).toBeCalled();
    expect(sendGenericErrorMessage).toBeCalledWith(
      testCharacter.channelId!,
      CharacterSocketEvents.CharacterForceDisconnect,
      {
        reason: "Sorry, you are not online.",
      }
    );
  });

  it("should throw a custom error if character is offline", async () => {
    testCharacter.isOnline = false;
    await testCharacter.save();

    const customOfflineMsg = "Sorry, your target is offline.";
    const result = characterValidation.hasBasicValidation(testCharacter, new Map([["not-online", customOfflineMsg]]));

    expect(result).toBe(false);
    expect(sendGenericErrorMessage).toBeCalled();
    expect(sendGenericErrorMessage).toBeCalledWith(
      testCharacter.channelId!,
      CharacterSocketEvents.CharacterForceDisconnect,
      {
        reason: customOfflineMsg,
      }
    );
  });
});
