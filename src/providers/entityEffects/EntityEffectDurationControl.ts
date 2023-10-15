import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";

@provide(EntityEffectDurationControl)
export class EntityEffectDurationControl {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async setDuration(
    entityEffectKey: string,
    targetId: string,
    attackerId: string,
    totalDurationMs: number
  ): Promise<void> {
    // entityEffect.totalDurationMs ?? -1,

    await this.inMemoryHashTable.set(
      "entity-effect-durations",
      `${entityEffectKey}-${targetId}-${attackerId}`,
      totalDurationMs
    );
  }

  public async getDuration(entityEffectKey: string, targetId: string, attackerId: string): Promise<number | undefined> {
    return (await this.inMemoryHashTable.get(
      "entity-effect-durations",
      `${entityEffectKey}-${targetId}-${attackerId}`
    )) as number | undefined;
  }

  public async clear(entityEffectKey: string, targetId: string, attackerId: string): Promise<void> {
    await this.inMemoryHashTable.delete("entity-effect-durations", `${entityEffectKey}-${targetId}-${attackerId}`);
  }

  public async clearAll(): Promise<void> {
    await this.inMemoryHashTable.deleteAll("entity-effect-durations");
  }
}
