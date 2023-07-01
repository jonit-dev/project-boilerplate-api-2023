import { appEnv } from "@providers/config/env";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { itemsBlueprintIndex } from "@providers/item/data";
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
    await this.loadBlueprintFor("items", itemsBlueprintIndex);
  }

  public getBlueprint<T>(namespace: BlueprintNamespaces, key: string): Promise<T> {
    return this.inMemoryHashTable.get(`blueprint-${namespace}`, key) as Promise<T>;
  }

  public async setBlueprint<T>(namespace: BlueprintNamespaces, key: string, data: T): Promise<void> {
    await this.inMemoryHashTable.set(`blueprint-${namespace}`, key, data);
  }

  public async updateBlueprint<T>(namespace: BlueprintNamespaces, key: string, data: T): Promise<void> {
    const blueprint = await this.getBlueprint<T>(namespace, key);

    await this.setBlueprint(namespace, key, {
      ...blueprint,
      ...data,
    });
  }

  private async loadBlueprintFor(
    namespace: BlueprintNamespaces,
    blueprintIndex: Record<string, Record<string, string>>
  ): Promise<void> {
    if (!appEnv.general.IS_UNIT_TEST) {
      console.time(`📜 Loading blueprints for ${namespace}...`);
    }
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
    if (!appEnv.general.IS_UNIT_TEST) {
      console.timeEnd(`📜 Loading blueprints for ${namespace}...`);
    }
  }

  private createHashFromBlueprint(blueprint: Record<string, unknown>): string {
    const hash = crypto.createHash("sha256");
    hash.update(JSON.stringify(blueprint));
    return hash.digest("hex");
  }
}
