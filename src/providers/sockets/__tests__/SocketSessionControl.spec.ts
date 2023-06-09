import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SocketSessionControl } from "../SocketSessionControl";

describe("SocketSessionControl", () => {
  let socketSessionControl: SocketSessionControl;
  let inMemoryHashTable: InMemoryHashTable;

  let testCharacter: ICharacter;

  beforeAll(async () => {
    socketSessionControl = container.get(SocketSessionControl);
    inMemoryHashTable = container.get(InMemoryHashTable);

    testCharacter = await unitTestHelper.createMockCharacter();
  });

  afterEach(async () => {
    // Clean up the hash table after each test
    await inMemoryHashTable.deleteAll("socket-sessions");
  });

  it("should set a session", async () => {
    await socketSessionControl.setSession(testCharacter);
    const sessionChannelId = await inMemoryHashTable.get("socket-sessions", testCharacter._id);

    expect(sessionChannelId).toBe(testCharacter.channelId);
  });

  it("should throw an error if character is not provided in setSession", async () => {
    // @ts-ignore
    await expect(socketSessionControl.setSession(undefined)).rejects.toThrow(
      "Failed to set socket session: Character not found"
    );
  });

  it("should check if a session exists", async () => {
    await inMemoryHashTable.set("socket-sessions", testCharacter._id, testCharacter.channelId);
    const sessionExists = await socketSessionControl.hasSession(testCharacter);

    expect(sessionExists).toBe(true);
  });

  it("should delete a session", async () => {
    await inMemoryHashTable.set("socket-sessions", testCharacter._id, testCharacter.channelId);
    await socketSessionControl.deleteSession(testCharacter);
    const sessionExists = await inMemoryHashTable.has("socket-sessions", testCharacter._id);

    expect(sessionExists).toBe(false);
  });

  it("should clear all sessions", async () => {
    const secondCharacter = await unitTestHelper.createMockCharacter();
    await inMemoryHashTable.set("socket-sessions", testCharacter._id, testCharacter.channelId);
    await inMemoryHashTable.set("socket-sessions", secondCharacter._id, secondCharacter.channelId);
    await socketSessionControl.clearAllSessions();
    const sessionExists1 = await inMemoryHashTable.has("socket-sessions", testCharacter._id);
    const sessionExists2 = await inMemoryHashTable.has("socket-sessions", secondCharacter._id);

    expect(sessionExists1).toBe(false);
    expect(sessionExists2).toBe(false);
  });
});
