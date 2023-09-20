import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";

@provide(SocketSessionControl)
export class SocketSessionControl {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async setSession(characterId: string): Promise<void> {
    if (!characterId) {
      throw new Error("Failed to set socket session: characterId not found");
    }

    return await this.inMemoryHashTable.set("socket-sessions", characterId, characterId);
  }

  public async hasSession(characterId: string): Promise<boolean> {
    if (!characterId) {
      throw new Error("Failed to check socket session: characterId not found");
    }

    const sessionInfo = await this.inMemoryHashTable.has("socket-sessions", characterId);

    return sessionInfo;
  }

  public async deleteSession(characterId: string): Promise<void> {
    if (!characterId) {
      throw new Error("Failed to delete socket session: characterId not found");
    }

    return await this.inMemoryHashTable.delete("socket-sessions", characterId);
  }

  public async clearAllSessions(): Promise<void> {
    return await this.inMemoryHashTable.deleteAll("socket-sessions");
  }
}
