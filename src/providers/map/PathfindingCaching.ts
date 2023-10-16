import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provide } from "inversify-binding-decorators";

// pull map versions

import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import mapVersions from "../../../public/config/map-versions.json";

interface IGridCoordinates {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
}

interface ICachedPathfinding {
  version: string;
  data: number[][];
}

@provide(PathfindingCaching)
export class PathfindingCaching {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  @TrackNewRelicTransaction()
  public async set(map: string, gridCoordinates: IGridCoordinates, calculatedPathfinding: number[][]): Promise<void> {
    const mapVersion = this.getMapVersion(map);

    if (!calculatedPathfinding) {
      return;
    }

    await this.inMemoryHashTable.set(
      "npc-pathfinding",
      `${map}|${gridCoordinates.start.x}|${gridCoordinates.start.y}|${gridCoordinates.end.x}|${gridCoordinates.end.y}`,
      {
        version: mapVersion,
        data: calculatedPathfinding,
      }
    );
  }

  @TrackNewRelicTransaction()
  public async get(map: string, gridCoordinates: IGridCoordinates): Promise<number[][] | undefined> {
    const isCacheOld = await this.hasOldCache(map, gridCoordinates);

    if (isCacheOld) {
      // delete cache
      await this.inMemoryHashTable.delete(
        "npc-pathfinding",
        `${map}|${gridCoordinates.start.x}|${gridCoordinates.start.y}|${gridCoordinates.end.x}|${gridCoordinates.end.y}`
      );

      return; // do not return anything
    }

    const cachedPathfinding = (await this.inMemoryHashTable.get(
      "npc-pathfinding",
      `${map}|${gridCoordinates.start.x}|${gridCoordinates.start.y}|${gridCoordinates.end.x}|${gridCoordinates.end.y}`
    )) as ICachedPathfinding;

    if (cachedPathfinding) {
      return cachedPathfinding?.data;
    }
  }

  public async delete(map: string, gridCoordinates: IGridCoordinates): Promise<void> {
    await this.inMemoryHashTable.delete(
      "npc-pathfinding",
      `${map}|${gridCoordinates.start.x}|${gridCoordinates.start.y}|${gridCoordinates.end.x}|${gridCoordinates.end.y}`
    );
  }

  private getMapVersion(map: string): string {
    const mapVersion = mapVersions[map];

    if (!mapVersion) {
      throw new Error(`Map version not found for map: ${map}`);
    }

    return mapVersion;
  }

  private async hasOldCache(map: string, gridCoordinates: IGridCoordinates): Promise<boolean> {
    const mapVersion = this.getMapVersion(map);

    const cache = (await this.inMemoryHashTable.get(
      "npc-pathfinding",
      `${map}|${gridCoordinates.start.x}|${gridCoordinates.start.y}|${gridCoordinates.end.x}|${gridCoordinates.end.y}`
    )) as ICachedPathfinding;

    if (!cache || !cache.version) {
      return false;
    }

    if (cache.version !== mapVersion) {
      return true;
    }

    return false;
  }
}
