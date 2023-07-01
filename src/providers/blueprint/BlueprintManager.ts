import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { npcsBlueprintIndex } from "@providers/npc/data";
import crypto from "crypto";
import { provide } from "inversify-binding-decorators";

export type BlueprintNamespaces = "npcs" | "items" | "spells" | "quests" | "recipes";

interface IStoredBlueprint {
  versionHash: string;
  [key: string]: unknown;
}

@provide(BlueprintManager)
export class BlueprintManager {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async loadAllBlueprints(): Promise<void> {
    await this.loadBlueprintFor("npcs", npcsBlueprintIndex);
  }

  public getDataFromBlueprint<T>(namespace: BlueprintNamespaces, key: string): Promise<T> {
    return this.inMemoryHashTable.get(`blueprint-${namespace}`, key) as Promise<T>;
  }

  private async loadBlueprintFor(
    namespace: BlueprintNamespaces,
    blueprintIndex: Record<string, Record<string, string>>
  ): Promise<void> {
    console.time(`📜 Loading blueprints for ${namespace}...`);
    for (const [key, blueprintData] of Object.entries(blueprintIndex)) {
      try {
        const currentHash = this.createHashFromBlueprint(blueprintData as Record<string, unknown>);

        // get existing hash
        const storedBlueprint = (await this.inMemoryHashTable.get(`blueprint-${namespace}`, key)) as IStoredBlueprint;
        const existingHash = storedBlueprint?.versionHash ?? null;

        if (existingHash === currentHash) {
          continue;
        }

        // if hashes are different, update the hash and store the blueprint

        await this.inMemoryHashTable.set(`blueprint-${namespace}`, key, {
          ...blueprintData,
          versionHash: currentHash,
        });
      } catch (error) {
        console.log(`❌ Error loading blueprint ${key} for ${namespace}!`);
        console.error(error);
      }
    }
    console.timeEnd(`📜 Loading blueprints for ${namespace}...`);
  }

  private createHashFromBlueprint(blueprint: Record<string, unknown>): string {
    const hash = crypto.createHash("sha256");
    hash.update(JSON.stringify(blueprint));
    return hash.digest("hex");
  }
}
