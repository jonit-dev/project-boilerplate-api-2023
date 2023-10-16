import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { appEnv } from "@providers/config/env";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { itemsBlueprintIndex } from "@providers/item/data";
import { AvailableBlueprints } from "@providers/item/data/types/itemsBlueprintTypes";
import { usableEffectsIndex } from "@providers/item/data/usableEffects";
import { IUsableEffect, IUsableEffectRune } from "@providers/item/data/usableEffects/types";
import { npcsBlueprintIndex } from "@providers/npc/data";
import { questsBlueprintIndex } from "@providers/quest/data";
import { spellsBlueprintsIndex } from "@providers/spells/data";
import { recipeBlueprintsIndex } from "@providers/useWith/blueprints/index";
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
    await Promise.all([
      this.loadBlueprintFor("npcs", npcsBlueprintIndex),
      this.loadBlueprintFor("items", itemsBlueprintIndex),
      this.loadBlueprintFor("quests", questsBlueprintIndex),
      this.loadBlueprintFor("spells", spellsBlueprintsIndex),
      this.loadBlueprintFor("recipes", recipeBlueprintsIndex),
    ]);
  }

  @TrackNewRelicTransaction()
  public async getBlueprint<T>(namespace: BlueprintNamespaces, key: AvailableBlueprints): Promise<T> {
    const blueprint = await this.inMemoryHashTable.get(`blueprint-${namespace}`, key);

    delete blueprint?.versionHash;

    if (namespace === "items") {
      // if item, lookup for usable effect and inject it on the blueprint
      let usableEffectBlueprint = usableEffectsIndex[blueprint?.usableEffectKey] as IUsableEffect | IUsableEffectRune;

      if (usableEffectBlueprint && blueprint) {
        blueprint.usableEffect = usableEffectBlueprint.usableEffect;
        blueprint.usableEffectDescription = usableEffectBlueprint.usableEffectDescription;

        usableEffectBlueprint = usableEffectBlueprint as IUsableEffectRune;
        if (usableEffectBlueprint.usableEntityEffect) {
          blueprint.usableEntityEffect = usableEffectBlueprint.usableEntityEffect;
        }
      }
    }

    return blueprint as T;
  }

  @TrackNewRelicTransaction()
  public async getAllBlueprintKeys(namespace: BlueprintNamespaces): Promise<string[]> {
    return await this.inMemoryHashTable.getAllKeys(`blueprint-${namespace}`);
  }

  @TrackNewRelicTransaction()
  public async getAllBlueprintValues<T>(namespace: BlueprintNamespaces): Promise<T[]> {
    const blueprints = (await this.inMemoryHashTable.getAll<T>(`blueprint-${namespace}`)) as Record<string, T>;

    return Object.values(blueprints);
  }

  @TrackNewRelicTransaction()
  public async setBlueprint<T>(namespace: BlueprintNamespaces, key: AvailableBlueprints, data: T): Promise<void> {
    await this.inMemoryHashTable.set(`blueprint-${namespace}`, key, data);
  }

  @TrackNewRelicTransaction()
  public async updateBlueprint<T>(namespace: BlueprintNamespaces, key: AvailableBlueprints, data: T): Promise<void> {
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
