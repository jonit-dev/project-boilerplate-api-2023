import { provideSingleton } from "@providers/inversify/provideSingleton";
import { MapLayers } from "@rpg-engine/shared";
import PF from "pathfinding";
import { MapHelper } from "./MapHelper";
import { MapSolids } from "./MapSolids";
import { MapTiles } from "./MapTiles";

@provideSingleton(GridManager)
export class GridManager {
  public grids: Map<string, PF.Grid> = new Map();

  constructor(private mapTiles: MapTiles, private mapSolids: MapSolids, private mapHelper: MapHelper) {}

  public generateGridSolids(map: string): void {
    const { gridOffsetX, gridOffsetY } = this.getGridOffset(map)!;

    const { width, height } = this.mapTiles.getMapWidthHeight(map, MapLayers.Ground, gridOffsetX, gridOffsetY);

    const newGrid = new PF.Grid(width, height);

    this.grids.set(map, newGrid);
    const grid = this.grids.get(map);

    if (!grid) {
      throw new Error("❌Could not find grid for map: " + map);
    }

    for (let gridX = 0; gridX < width; gridX++) {
      for (let gridY = 0; gridY < height; gridY++) {
        // isTileSolid will get the ge_collide property directly from the json file, thats why we should use "raw coordinates", in other words, we should subtract the tileset!
        const isSolid = this.mapSolids.isTileSolid(map, gridX - gridOffsetX, gridY - gridOffsetY, MapLayers.Character);
        const isPassage = this.mapSolids.isTilePassage(
          map,
          gridX - gridOffsetX,
          gridY - gridOffsetY,
          MapLayers.Character
        );

        this.setWalkable(map, gridX, gridY, !isSolid || isPassage);
      }
    }
  }

  public isWalkable(map: string, gridX: number, gridY: number): boolean | undefined {
    const { gridOffsetX, gridOffsetY } = this.getGridOffset(map)!;

    const offsetGridX = gridX + gridOffsetX;
    const offsetGridY = gridY + gridOffsetY;

    try {
      const grid = this.grids.get(map);

      if (!grid) {
        throw new Error("❌Could not find grid for map: " + map);
      }

      return grid.isWalkableAt(offsetGridX, offsetGridY);
    } catch (error) {
      console.log(
        `Failed to check isWalkable for gridX ${gridX}, gridY ${gridY} (offsetGrid: ${offsetGridX}, ${offsetGridY}) on map ${map}. Offset is: ${gridOffsetX}, ${gridOffsetY}`
      );
      console.error(error);
    }
  }

  public setWalkable(map: string, gridX: number, gridY: number, walkable: boolean): void {
    const { gridOffsetX, gridOffsetY } = this.getGridOffset(map)!;

    const { width, height } = this.mapTiles.getMapWidthHeight(map, MapLayers.Ground, gridOffsetX, gridOffsetY);

    try {
      const grid = this.grids.get(map);

      if (!grid) {
        throw new Error("❌Could not find grid for map: " + map);
      }

      grid.setWalkableAt(gridX, gridY, walkable);
    } catch (error) {
      console.log(
        `Failed to setWalkable=${walkable} for gridX ${gridX}, gridY ${gridY} on map ${map} (${width}, ${height})`
      );
      console.error(error);
    }
  }

  public getGridOffset(map: string): { gridOffsetX: number; gridOffsetY: number } | undefined {
    const initialXY = this.mapTiles.getFirstXY(map, MapLayers.Ground);

    if (!initialXY) {
      console.log(`❌ Failed to get first XY for ${map}`);
      return;
    }
    const initialX = initialXY[0];
    const initialY = initialXY[1];

    let gridOffsetX = 0;
    let gridOffsetY = 0;

    if (initialX < 0) {
      gridOffsetX = Math.abs(initialX);
    }
    if (initialY < 0) {
      gridOffsetY = Math.abs(initialY);
    }

    return {
      gridOffsetX,
      gridOffsetY,
    };
  }

  public findShortestPath(
    map: string,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): number[][] | undefined {
    // Check if grid exists for the given map
    const gridMap = this.grids.get(map);
    if (!gridMap) {
      throw new Error(`❌ Could not find grid for map: ${map}`);
    }

    // Clone the grid to avoid modifying the original
    const tempGrid = gridMap.clone();
    if (!tempGrid) {
      throw new Error(`❌ Could not clone grid for map: ${map}`);
    }

    // Use A* pathfinding algorithm to find shortest path
    const finder = new PF.AStarFinder();

    // Remap path without grid offset
    const { gridOffsetX, gridOffsetY } = this.getGridOffset(map)!;
    const startX = startGridX + (gridOffsetX ?? 0);
    const startY = startGridY + (gridOffsetY ?? 0);
    const endX = endGridX + (gridOffsetX ?? 0);
    const endY = endGridY + (gridOffsetY ?? 0);

    if (!this.mapHelper.areAllCoordinatesValid([startX, startY], [endX, endY])) {
      return;
    }

    // Set start and end points to walkable in temporary grid
    tempGrid.setWalkableAt(startX, startY, true);
    tempGrid.setWalkableAt(endX, endY, true);

    const path = finder.findPath(
      startGridX + gridOffsetX,
      startGridY + gridOffsetY,
      endGridX + gridOffsetX,
      endGridY + gridOffsetY,
      tempGrid
    );

    const newPath = path.map(([x, y]) => [x - (gridOffsetX ?? 0), y - (gridOffsetY ?? 0)]);

    return newPath;
  }
}
