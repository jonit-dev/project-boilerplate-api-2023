import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";

@provide(Locker)
export class Locker {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  @TrackNewRelicTransaction()
  public async lock(key: string, ttlSeconds?: number): Promise<boolean> {
    //* atomic setNx operation. If the key already exists, it will return false.
    const result = await this.inMemoryHashTable.setNx("locks", key, true);

    if (result && ttlSeconds) {
      await this.inMemoryHashTable.expire("locks", ttlSeconds, "NX");
    }

    return result;
  }

  public async hasLock(key: string): Promise<boolean> {
    const result = await this.inMemoryHashTable.has("locks", key);
    return result;
  }

  public async unlock(key: string): Promise<void> {
    await this.inMemoryHashTable.delete("locks", key);
  }

  public async clear(): Promise<void> {
    await this.inMemoryHashTable.deleteAll("locks");
  }
}
