import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { CharacterSocketEvents } from "@rpg-engine/shared";
import { CharacterTextureChange } from "../CharacterTextureChange";

jest.useFakeTimers({ advanceTimers: true });

jest.mock("@entities/ModuleCharacter/CharacterModel", () => ({
  Character: {
    findByIdAndUpdate: jest.fn(),
  },
}));
describe("CharacterTextureChange.ts", () => {
  let characterTextureChange: CharacterTextureChange;
  let testCharacter: ICharacter;

  const mockSocketMessaging = {
    sendEventToAllUsers: jest.fn(),
    sendMessageToCharacter: jest.fn(),
  };

  const mockInMemoryHashTable = {
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(() => {
    characterTextureChange = container.get<CharacterTextureChange>(CharacterTextureChange);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();
    jest.clearAllMocks();

    // @ts-expect-error
    characterTextureChange.socketMessaging = mockSocketMessaging;

    // @ts-expect-error
    characterTextureChange.inMemoryHashTable = mockInMemoryHashTable;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
  });

  it("should change the texture of a character", async () => {
    const textureKey = "rat";
    const timeInterval = 1;

    mockInMemoryHashTable.get.mockResolvedValue(testCharacter.textureKey);
    await characterTextureChange.changeTexture(testCharacter, textureKey, timeInterval);

    expect(mockSocketMessaging.sendEventToAllUsers).toBeCalledWith(CharacterSocketEvents.AttributeChanged, {
      targetId: testCharacter._id,
      textureKey: textureKey,
    });

    expect(mockSocketMessaging.sendMessageToCharacter).toBeCalledWith(
      testCharacter,
      `You've morphed into a ${textureKey} for ${timeInterval} seconds!`
    );

    expect(mockInMemoryHashTable.set).toBeCalledWith("spell", testCharacter._id.toString(), testCharacter.textureKey);
  });

  it("should handle errors thrown during the execution of the timeout callback", async () => {
    const expectedError = new Error("Test error");

    mockInMemoryHashTable.get.mockRejectedValue(expectedError);

    try {
      const changeTexturePromise = characterTextureChange.changeTexture(testCharacter, "rat", 1);

      jest.advanceTimersByTime(1000);

      await changeTexturePromise;
    } catch (error) {
      expect(error).toEqual(expectedError);

      expect(mockSocketMessaging.sendEventToAllUsers).toHaveBeenCalledTimes(1);

      expect(mockInMemoryHashTable.delete).not.toHaveBeenCalled();
    }
  });
});
