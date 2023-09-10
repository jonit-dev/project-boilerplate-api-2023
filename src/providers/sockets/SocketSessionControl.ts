import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";

@provide(SocketSessionControl)
export class SocketSessionControl {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async setSession(channelId: string, characterId: string): Promise<void> {
    if (!channelId) {
      throw new Error("Failed to set socket session: channelId not found");
    }

    return await this.inMemoryHashTable.set("socket-sessions", channelId, characterId);
  }

  public async hasSession(channelId: string): Promise<boolean> {
    if (!channelId) {
      throw new Error("Failed to check socket session: channelId not found");
    }

    const sessionInfo = await this.inMemoryHashTable.has("socket-sessions", channelId);

    return sessionInfo;
  }

  public async deleteSession(channelId: string): Promise<void> {
    if (!channelId) {
      throw new Error("Failed to delete socket session: channelId not found");
    }

    return await this.inMemoryHashTable.delete("socket-sessions", channelId);
  }

  public async clearAllSessions(): Promise<void> {
    return await this.inMemoryHashTable.deleteAll("socket-sessions");
  }
}
