import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";
import { clearCacheForKey } from "speedgoose";

@provide(ItemCraftableCaching)
export class ItemCraftableCaching {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async clearCraftbookCache(characterId: string): Promise<void> {
    await this.inMemoryHashTable.delete("load-craftable-items", characterId);
    await clearCacheForKey(`${characterId}-skills`);
    await clearCacheForKey(`${characterId}-inventory`);
  }
}
