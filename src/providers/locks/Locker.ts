import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";

@provide(Locker)
export class Locker {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async lock(key: string): Promise<boolean> {
    //* atomic setNx operation. If the key already exists, it will return false.
    const result = await this.inMemoryHashTable.setNx("locks", key, true);
    return result;
  }

  public async unlock(key: string): Promise<void> {
    await this.inMemoryHashTable.delete("locks", key);
  }

  public async clear(): Promise<void> {
    await this.inMemoryHashTable.deleteAll("locks");
  }
}
