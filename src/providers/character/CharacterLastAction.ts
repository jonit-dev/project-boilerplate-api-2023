import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";

@provide(CharacterLastAction)
export class CharacterLastAction {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async setLastAction(characterId: string, lastAction: string): Promise<void> {
    await this.inMemoryHashTable.set("character-lastAction:characterId", characterId, lastAction);
  }

  public async getLastAction(characterId: string): Promise<string | undefined> {
    const lastAction = await this.inMemoryHashTable.get("character-lastAction:characterId", characterId);
    return lastAction?.toString();
  }

  public async clearLastAction(characterId: string): Promise<void> {
    await this.inMemoryHashTable.delete("character-lastAction:characterId", characterId);
  }

  public async clearAllLastActions(): Promise<void> {
    await this.inMemoryHashTable.deleteAll("character-lastAction:characterId");
  }

  public async getActionLastExecution(characterId: string, action: string): Promise<string | undefined> {
    const characterLastAction = await this.inMemoryHashTable.get(`character-${action}-last-execution`, characterId);
    return characterLastAction?.toString();
  }

  public async setActionLastExecution(characterId: string, action: string): Promise<void> {
    await this.inMemoryHashTable.set(`character-${action}-last-execution`, characterId, dayjs(new Date()));
  }
}
