import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import SpellSilence from "../druid/SpellSilence";

describe("SpellSilence", () => {
  let spellSilencer: SpellSilence;
  let mockCharacter: ICharacter;
  let targetCharacter: ICharacter;

  beforeAll(() => {
    jest.useFakeTimers({
      advanceTimers: true,
    });
  });

  beforeEach(async () => {
    spellSilencer = container.get<SpellSilence>(SpellSilence);
    mockCharacter = await unitTestHelper.createMockCharacter();
    targetCharacter = await unitTestHelper.createMockCharacter();
  });

  describe("silenceCharacter", () => {
    it("should silence a character", async () => {
      const inMemoryHashTableMock = jest.spyOn(InMemoryHashTable.prototype, "set");
      const socketMessagingMock = jest.spyOn(SocketMessaging.prototype, "sendMessageToCharacter");

      await spellSilencer.silenceCharacter(mockCharacter, targetCharacter, 1);

      expect(inMemoryHashTableMock).toHaveBeenCalledWith("silenced", targetCharacter.id, true);
      expect(socketMessagingMock).toHaveBeenCalledWith(
        targetCharacter,
        "You can't cast any spell for 1 seconds (silenced)"
      );
      expect(socketMessagingMock).toHaveBeenCalledWith(mockCharacter, "You've silenced " + targetCharacter.name + "!");

      inMemoryHashTableMock.mockRestore();
      socketMessagingMock.mockRestore();
    });
  });

  describe("isSilent", () => {
    it("should check if a character is silent", async () => {
      const inMemoryHashTableMock = jest.spyOn(InMemoryHashTable.prototype, "has");

      await spellSilencer.isSilent(targetCharacter);

      expect(inMemoryHashTableMock).toHaveBeenCalledWith("silenced", targetCharacter.id);

      inMemoryHashTableMock.mockRestore();
    });
  });

  describe("removeAllSilence", () => {
    it("should remove all silence", async () => {
      const inMemoryHashTableMock = jest.spyOn(InMemoryHashTable.prototype, "deleteAll");

      await spellSilencer.removeAllSilence();

      expect(inMemoryHashTableMock).toHaveBeenCalledWith("silenced");

      inMemoryHashTableMock.mockRestore();
    });
  });
});
