import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { HashGenerator } from "@providers/hash/HashGenerator";
import { provide } from "inversify-binding-decorators";

@provide(ContainerSlotsCaching)
export class ContainerSlotsCaching {
  constructor(private inMemoryHashTable: InMemoryHashTable, private hashGenerator: HashGenerator) {}

  @TrackNewRelicTransaction()
  public async setSlotsHash(id: string, payload: Record<string, unknown>): Promise<void> {
    // generate and save a hash, so we can keep track if the slots changed
    const slotsHash = this.hashGenerator.generateHash(payload);

    await this.inMemoryHashTable.set("container-slots-hash", id, slotsHash);
  }

  public async getSlotsHash(id: string): Promise<string | undefined> {
    return (await this.inMemoryHashTable.get("container-slots-hash", id)) as unknown as string;
  }

  public async deleteSlotsHash(id: string): Promise<void> {
    await this.inMemoryHashTable.delete("container-slots-hash", id);
  }
}
