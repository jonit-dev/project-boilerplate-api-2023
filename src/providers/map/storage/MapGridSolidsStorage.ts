import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";

import mapVersions from "../../../../public/config/map-versions.json";

interface IMapStoredGridInfo {
  version: string;
  grid: number[][];
}

@provide(MapGridSolidsStorage)
export class MapGridSolidsStorage {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async setGridSolids(map: string, grid: number[][]): Promise<void> {
    const version = this.getMapVersion(map);

    await this.inMemoryHashTable.set("map-grid-solids", map, {
      version,
      grid,
    });
  }

  public async getGridSolids(map: string): Promise<number[][] | undefined> {
    const mapInfo = (await this.inMemoryHashTable.get("map-grid-solids", map)) as IMapStoredGridInfo;

    return mapInfo?.grid;
  }

  public async getGridSolidsVersion(map: string): Promise<string | undefined> {
    const mapInfo = (await this.inMemoryHashTable.get("map-grid-solids", map)) as IMapStoredGridInfo;

    return mapInfo?.version;
  }

  public async hasGridSolids(map: string): Promise<boolean> {
    return await this.inMemoryHashTable.has("map-grid-solids", map);
  }

  public async deleteGridSolids(map: string): Promise<void> {
    await this.inMemoryHashTable.delete("map-grid-solids", map);
  }

  public async clearGridSolids(): Promise<void> {
    await this.inMemoryHashTable.deleteAll("map-grid-solids");
  }

  private getMapVersion(map: string): string {
    const version = mapVersions[map];

    if (!version) {
      throw new Error(`Map ${map} does not exist!`);
    }

    return version;
  }
}
