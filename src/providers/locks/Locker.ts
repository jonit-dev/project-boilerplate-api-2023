import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";

@provide(Locker)
export class Locker {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async lock(key: string): Promise<boolean> {
    const isLocked = await this.isLocked(key);
    if (!isLocked) {
      await this.inMemoryHashTable.set("locks", key, true);
      return true;
    }
    return false;
  }

  public async unlock(key: string): Promise<void> {
    await this.inMemoryHashTable.delete("locks", key);
  }

  public async isLocked(key: string): Promise<boolean> {
    const result = !!(await this.inMemoryHashTable.get("locks", key));

    return result === true;
  }

  public async clear(): Promise<void> {
    await this.inMemoryHashTable.deleteAll("locks");
  }
}
