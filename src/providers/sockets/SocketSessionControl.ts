import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";

@provide(SocketSessionControl)
export class SocketSessionControl {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async setSession(character: ICharacter): Promise<void> {
    if (!character) {
      throw new Error("Failed to set socket session: Character not found");
    }

    return await this.inMemoryHashTable.set("socket-sessions", character._id, character.channelId!);
  }

  public async hasSession(character: ICharacter): Promise<boolean> {
    const sessionInfo = await this.inMemoryHashTable.has("socket-sessions", character._id);

    return sessionInfo;
  }

  public async deleteSession(character: ICharacter): Promise<void> {
    return await this.inMemoryHashTable.delete("socket-sessions", character._id);
  }

  public async clearAllSessions(): Promise<void> {
    return await this.inMemoryHashTable.deleteAll("socket-sessions");
  }
}
