import { provideSingleton } from "@providers/inversify/provideSingleton";
import { MapLayers } from "@rpg-engine/shared";
import PF from "pathfinding";
import { MapSolids } from "./MapSolids";
import { MapTiles } from "./MapTiles";

@provideSingleton(GridManager)
export class GridManager {
  public grids: Map<string, PF.Grid> = new Map();

  constructor(private mapTiles: MapTiles, private mapSolids: MapSolids) {}

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
    const gridMap = this.grids.get(map);

    if (!gridMap) {
      throw new Error("❌Could not find grid for map: " + map);
    }

    const tempGrid = gridMap.clone(); // should be cloned, otherwise it will be modified by the finder!

    if (!tempGrid) {
      throw new Error("❌Could not clone grid for map: " + map);
    }

    const finder = new PF.AStarFinder();

    //! According to the docs, both start and end point MUST be walkable, otherwise it will return [] and crash the pathfinding!
    //! To avoid any issues in the main grid we'll just set this walkable in the tempGrid!
    // remap path without offset
    const { gridOffsetX, gridOffsetY } = this.getGridOffset(map)!;

    tempGrid.setWalkableAt(startGridX + gridOffsetX, startGridY + gridOffsetY, true);
    tempGrid.setWalkableAt(endGridX + gridOffsetX, endGridY + gridOffsetY, true);

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
