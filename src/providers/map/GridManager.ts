import { provideSingleton } from "@providers/inversify/provideSingleton";
import { MapLayers } from "@rpg-engine/shared";
import PF from "pathfinding";
import { MapSolids } from "./MapSolids";
import { MapGridSolidsStorage } from "./storage/MapGridSolidsStorage";

import mapVersions from "../../../public/config/map-versions.json";
import { MapProperties } from "./MapProperties";

export interface IGridCourse {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
  offset?: number;
}

export interface IGridBounds {
  startX: number;
  startY: number;
  height: number;
  width: number;
}
interface IGridBetweenPoints {
  grid: PF.Grid;
  startX: number;
  startY: number;
}

@provideSingleton(GridManager)
export class GridManager {
  private grids: Map<string, number[][]> = new Map();

  constructor(
    private mapSolids: MapSolids,
    private mapGridSolidsStorage: MapGridSolidsStorage,
    private mapProperties: MapProperties
  ) {}

  public getGrid(map: string): number[][] {
    return this.grids.get(map)!;
  }

  public hasGrid(map: string): boolean {
    return !!this.grids.get(map);
  }

  public async generateGridSolids(map: string): Promise<void> {
    const bounds = this.mapProperties.getMapDimensions(map, true);
    const offset = this.mapProperties.getMapOffset(bounds.startX, bounds.startY)!;

    const currentMapVersion = mapVersions[map];

    // check if we already have the grid for this map on redis (pre-calculated), or if we should calculate it
    const storedMapVersion = await this.mapGridSolidsStorage.getGridSolidsVersion(map);

    if (storedMapVersion && storedMapVersion === currentMapVersion) {
      const tree = await this.mapGridSolidsStorage.getGridSolids(map);

      if (!tree) {
        throw new Error("❌Could not find grid for map: " + map);
      }

      this.grids.set(map, tree);

      return;
    }

    // if not, delete what we have there and regenerate

    await this.mapGridSolidsStorage.deleteGridSolids(map);

    const tree: number[][] = []; // new Quadtree({ width: bounds.width, height: bounds.height });

    for (let gridY = bounds.startY; gridY < bounds.height; gridY++) {
      for (let gridX = bounds.startX; gridX < bounds.width; gridX++) {
        // isTileSolid will get the ge_collide property directly from the json file, thats why we should use "raw coordinates", in other words, we should subtract the tileset!
        const isSolid = this.mapSolids.isTileSolid(map, gridX, gridY, MapLayers.Character);
        const isPassage = this.mapSolids.isTilePassage(map, gridX, gridY, MapLayers.Character);
        const isWalkable = !isSolid || isPassage;

        const offsetX = gridX + offset.gridOffsetX;
        const offsetY = gridY + offset.gridOffsetY;

        if (!tree[offsetY]) {
          tree[offsetY] = [];
        }

        tree[offsetY][offsetX] = isWalkable ? 0 : 1;
      }
    }

    await this.mapGridSolidsStorage.setGridSolids(map, tree);

    this.grids.set(map, tree);
  }

  public async isWalkable(map: string, gridX: number, gridY: number): Promise<boolean | undefined> {
    try {
      const grid = await this.getGrid(map);

      if (!grid) {
        throw new Error("❌Could not find grid for map: " + map);
      }

      const bounds = this.mapProperties.getMapDimensions(map);
      const offset = this.mapProperties.getMapOffset(bounds.startX, bounds.startY)!;

      return grid[gridY + offset.gridOffsetY][gridX + offset.gridOffsetX] === 0;
    } catch (error) {
      console.log(`Failed to check isWalkable for gridX ${gridX}, gridY ${gridY}`);
      console.error(error);
    }
  }

  public async setWalkable(map: string, gridX: number, gridY: number, walkable: boolean): Promise<void> {
    try {
      const grid = await this.getGrid(map);

      if (!grid) {
        throw new Error("❌Could not find grid for map: " + map);
      }

      const bounds = this.mapProperties.getMapDimensions(map);
      const offset = this.mapProperties.getMapOffset(bounds.startX, bounds.startY)!;

      grid[gridY + offset.gridOffsetY][gridX + offset.gridOffsetX] = walkable ? 0 : 1;
      // also save this change to redis, so it can persist. Otherwise, we'll get a brand new grid everytime we call this.getGrid
    } catch (error) {
      console.log(`Failed to setWalkable=${walkable} for gridX ${gridX}, gridY ${gridY} on map ${map}`);
      console.error(error);
    }
  }

  public generateGridBetweenPoints(map: string, gridCourse: IGridCourse): IGridBetweenPoints {
    const tree = this.getGrid(map);

    if (!tree || tree.length === 0) {
      throw new Error(`❌ The tree is empty or not defined for map: ${map}`);
    }

    const dimens = this.mapProperties.getMapDimensions(map);
    const offset = this.mapProperties.getMapOffset(dimens.startX, dimens.startY)!;

    if (!offset) {
      throw new Error(`❌ Offset is not defined for startX: ${dimens.startX} and startY: ${dimens.startY}`);
    }

    const bounds = this.getSubGridBounds(map, gridCourse);

    if (bounds.startY + bounds.height > tree.length) {
      throw new Error(`❌ The vertical bounds exceed the grid height for map: ${map}`);
    }

    if (tree[0] && bounds.startX + bounds.width > tree[0].length) {
      throw new Error(`❌ The horizontal bounds exceed the grid width for map: ${map}`);
    }

    const solids = new Set();

    for (let y = bounds.startY + offset.gridOffsetY; y < bounds.startY + bounds.height + offset.gridOffsetY; y++) {
      for (let x = bounds.startX + offset.gridOffsetX; x < bounds.startX + bounds.width + offset.gridOffsetX; x++) {
        if (tree[y] && tree[y][x] === 1) {
          solids.add(`${x}-${y}`);
        }
      }
    }

    const matrix = this.generateMatrixBetweenPoints(bounds, (gridX, gridY) =>
      solids.has(`${gridX + offset.gridOffsetX}-${gridY + offset.gridOffsetY}`)
    );

    const pf = new PF.Grid(matrix);

    return { grid: pf, startX: bounds.startX, startY: bounds.startY };
  }

  private getSubGridBounds(map: string, gridCourse: IGridCourse): IGridBounds {
    const { start, end } = gridCourse;

    let startX = start.x < end.x ? start.x : end.x;
    let startY = start.y < end.y ? start.y : end.y;

    let width = Math.abs(end.x - start.x) + 1;
    let height = Math.abs(end.y - start.y) + 1;

    if (gridCourse.offset && gridCourse.offset > 0) {
      const mapDimens = this.mapProperties.getMapDimensions(map);

      const minGridX = mapDimens.startX;
      const minGridY = mapDimens.startY;

      const maxGridX = mapDimens.width + minGridX;
      const maxGridY = mapDimens.height + minGridY;

      const newX = startX - gridCourse.offset;
      const newY = startY - gridCourse.offset;

      startX = newX < minGridX ? minGridX : newX;
      startY = newY < minGridY ? minGridY : newY;

      const availableWidth = Math.abs(maxGridX - startX);
      const availableHeight = Math.abs(maxGridY - startY);

      const newWidth = width + gridCourse.offset * 2;
      const newHeight = height + gridCourse.offset * 2;

      width = newWidth > availableWidth ? availableWidth : newWidth;
      height = newHeight > availableHeight ? availableHeight : newHeight;
    }

    return {
      startX,
      startY,
      height,
      width,
    };
  }

  private generateMatrixBetweenPoints(
    bounds: IGridBounds,
    isSolidFn: (gridX: number, gridY: number) => boolean
  ): number[][] {
    const matrix = new Int8Array(bounds.width * bounds.height);
    const matrixRowLength = bounds.width;

    for (let gridY = 0; gridY < bounds.height; gridY++) {
      const matrixRowIndex = gridY * matrixRowLength;

      for (let gridX = 0; gridX < bounds.width; gridX++) {
        const isWalkable = !isSolidFn(gridX + bounds.startX, gridY + bounds.startY);
        matrix[matrixRowIndex + gridX] = isWalkable ? 0 : 1;
      }
    }

    const result: number[][] = [];
    for (let i = 0; i < matrix.length; i += matrixRowLength) {
      result.push(Array.from(matrix.subarray(i, i + matrixRowLength)));
    }

    if (!result.length) {
      throw new Error("Failed to generate pathfinding grid");
    }

    return result;
  }
}
