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
    sendEventToCharactersAroundCharacter: jest.fn(),
  };

  const mockInMemoryHashTable = {
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    has: jest.fn(),
    getAll: jest.fn(),
    deleteAll: jest.fn(),
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

    expect(mockSocketMessaging.sendEventToCharactersAroundCharacter).toBeCalledWith(
      testCharacter,
      CharacterSocketEvents.AttributeChanged,
      {
        targetId: testCharacter._id,
        textureKey: textureKey,
      }
    );

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

      expect(mockSocketMessaging.sendEventToCharactersAroundCharacter).toHaveBeenCalledTimes(1);

      expect(mockInMemoryHashTable.delete).not.toHaveBeenCalled();
    }
  });

  it("should only change the texture if there is no existing spell for the character", async () => {
    const textureKey = "rat";
    const timeInterval = 1;
    const normalTextureKey = "normal";
    const namespace = "spell";
    const spellType = "SpellType";
    testCharacter.textureKey = normalTextureKey;

    mockInMemoryHashTable.get.mockResolvedValue(normalTextureKey);
    mockInMemoryHashTable.getAll.mockResolvedValue({ [namespace]: true });
    mockInMemoryHashTable.has.mockResolvedValue(true);

    await characterTextureChange.changeTexture(testCharacter, textureKey, timeInterval);

    // check if the spell type exists and is not updated
    expect(mockInMemoryHashTable.getAll).toBeCalledWith(spellType);
    expect(mockInMemoryHashTable.set).not.toHaveBeenCalledWith(spellType, namespace, true);

    // check if the character texture is not updated
    expect(mockInMemoryHashTable.set).not.toHaveBeenCalledWith(
      namespace,
      testCharacter._id.toString(),
      normalTextureKey
    );

    // check if the character texture is updated when there's no existing spell
    mockInMemoryHashTable.has.mockResolvedValue(false);
    await characterTextureChange.changeTexture(testCharacter, textureKey, timeInterval);
    expect(mockInMemoryHashTable.set).toBeCalledWith(namespace, testCharacter._id.toString(), normalTextureKey);
    expect(mockInMemoryHashTable.set).toBeCalledWith(spellType, namespace, true);
  });

  it("should remove all texture changes and update character textures according to the stored spells", async () => {
    // Mock objects to represent stored spells and their textures
    const mockSpellTypeStored = {
      spell1: "texture1",
      spell2: "texture2",
    };
    const mockSpells = {
      spellKey1: "textureKey1",
      spellKey2: "textureKey2",
    };

    // Mock implementation of getAll method for the InMemoryHashTable
    mockInMemoryHashTable.getAll.mockImplementation((key) => {
      if (key === "SpellType") return Promise.resolve(mockSpellTypeStored);
      if (key in mockSpellTypeStored) return Promise.resolve(mockSpells);
      return Promise.resolve(null);
    });
    mockInMemoryHashTable.deleteAll.mockResolvedValue(null);

    // Spy on updateCharacterTexture method and mock its implementation
    const spyUpdateCharacterTexture = jest
      // @ts-expect-error
      .spyOn(characterTextureChange, "updateCharacterTexture")
      // @ts-expect-error
      .mockImplementation(() => Promise.resolve());

    await characterTextureChange.removeAllTextureChange();

    // Check if getAll is called first for 'SpellType'
    expect(mockInMemoryHashTable.getAll).toHaveBeenNthCalledWith(1, "SpellType");

    // Check if deleteAll is called first for 'SpellType'
    expect(mockInMemoryHashTable.deleteAll).toHaveBeenNthCalledWith(1, "SpellType");

    // Check if getAll is called for each spell in spellTypeStored
    expect(mockInMemoryHashTable.getAll).toHaveBeenNthCalledWith(2, "spell1");
    expect(mockInMemoryHashTable.getAll).toHaveBeenNthCalledWith(3, "spell2");

    // Check if deleteAll is called for each spell in spellTypeStored
    expect(mockInMemoryHashTable.deleteAll).toHaveBeenNthCalledWith(2, "spell1");
    expect(mockInMemoryHashTable.deleteAll).toHaveBeenNthCalledWith(3, "spell2");

    // Check if updateCharacterTexture is called with each spellKey and texture from the stored spells
    expect(spyUpdateCharacterTexture).toHaveBeenNthCalledWith(1, "spellKey1", "textureKey1");
    expect(spyUpdateCharacterTexture).toHaveBeenNthCalledWith(2, "spellKey2", "textureKey2");
  });
});
