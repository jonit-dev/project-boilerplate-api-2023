import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provideSingleton } from "@providers/inversify/provideSingleton";

export interface ISolidSnapshot {
  [coordinates: string]: boolean;
}

@provideSingleton(MapSolidsStorage)
export class MapSolidsStorage {
  private mapSolids: Map<string, Set<string>> = new Map();

  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async saveSolidsSnapshot(map: string, solidsSnapshot: ISolidSnapshot): Promise<void> {
    console.log("🗺️ Saving solids snapshot for map ", map);

    const snapshotSet = new Set(Object.keys(solidsSnapshot));

    // Convert Set to string
    const snapshotString = JSON.stringify(Array.from(snapshotSet));

    await this.inMemoryHashTable.set("map-solids", map, snapshotString);

    this.mapSolids.set(map, snapshotSet);
  }

  public async readSolidsSnapshot(map: string): Promise<void> {
    const snapshotString = (await this.inMemoryHashTable.get("map-solids", map)) as unknown as string;

    if (!snapshotString) {
      throw new Error("❌Could not find solids snapshot for map: " + map);
    }

    // Parse string back to Set
    const snapshotSet = new Set(JSON.parse(snapshotString)) as Set<string>;

    this.mapSolids.set(map, snapshotSet);
  }

  public async hasSolidSnapshot(map: string): Promise<boolean> {
    return await this.inMemoryHashTable.has("map-solids", map);
  }

  public isSolid(map: string, gridX: number, gridY: number, layer: number): boolean | undefined {
    const mapData = this.mapSolids.get(map);

    if (!mapData) {
      return undefined;
    }

    const hasSolid = mapData.has(`${gridX}:${gridY}:${layer}`);

    if (hasSolid) {
      return true;
    }
  }

  public async deleteSolidsSnapshot(map: string): Promise<void> {
    await this.inMemoryHashTable.delete("map-solids", map);
    this.mapSolids.delete(map);
  }
}
