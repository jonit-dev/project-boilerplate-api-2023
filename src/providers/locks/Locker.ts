import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";

@provide(Locker)
export class Locker {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async lock(key: string): Promise<void> {
    await this.inMemoryHashTable.set("locks", key, true);
  }

  public async unlock(key: string): Promise<void> {
    await this.inMemoryHashTable.set("locks", key, false);
  }

  public async isLocked(key: string): Promise<boolean> {
    const result = (await this.inMemoryHashTable.get("locks", key)) as unknown as boolean;

    return result === true;
  }

  public async clear(): Promise<void> {
    await this.inMemoryHashTable.deleteAll("locks");
  }
}
