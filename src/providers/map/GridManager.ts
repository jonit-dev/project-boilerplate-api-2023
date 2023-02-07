import { provideSingleton } from "@providers/inversify/provideSingleton";
import { MapLayers } from "@rpg-engine/shared";
import PF from "pathfinding";
import { MapHelper } from "./MapHelper";
import { MapSolids } from "./MapSolids";
import { MapTiles } from "./MapTiles";

interface IGridCourse {
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

interface IGridBounds {
  startX: number;
  startY: number;
  height: number;
  width: number;
}

@provideSingleton(GridManager)
export class GridManager {
  private grids: Map<string, number[][]> = new Map();

  private gridDimensions: Map<string, IGridBounds> = new Map();

  constructor(private mapTiles: MapTiles, private mapSolids: MapSolids, private mapHelper: MapHelper) {}

  public getGrid(map: string): Promise<number[][]> {
    return new Promise((resolve) => {
      resolve(this.grids.get(map)!);
    });
  }

  public hasGrid(map: string): boolean {
    return !!this.grids.get(map);
  }

  public generateGridSolids(map: string): void {
    const bounds = this.getMapDimensions(map, true);
    const offset = this.getMapOffset(bounds.startX, bounds.startY)!;

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

    this.grids.set(map, tree);
  }

  public async isWalkable(map: string, gridX: number, gridY: number): Promise<boolean | undefined> {
    try {
      const grid = await this.getGrid(map);

      if (!grid) {
        throw new Error("❌Could not find grid for map: " + map);
      }

      const bounds = this.getMapDimensions(map);
      const offset = this.getMapOffset(bounds.startX, bounds.startY)!;

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

      const bounds = this.getMapDimensions(map);
      const offset = this.getMapOffset(bounds.startX, bounds.startY)!;

      grid[gridY + offset.gridOffsetY][gridX + offset.gridOffsetX] = walkable ? 0 : 1;
      // also save this change to redis, so it can persist. Otherwise, we'll get a brand new grid everytime we call this.getGrid
    } catch (error) {
      console.log(`Failed to setWalkable=${walkable} for gridX ${gridX}, gridY ${gridY} on map ${map}`);
      console.error(error);
    }
  }

  private getMapDimensions(map: string, calculate?: boolean): IGridBounds {
    let dimens = !calculate ? this.gridDimensions.get(map) : null;
    if (dimens) {
      return dimens;
    }

    const initialXY = this.mapTiles.getFirstXY(map, MapLayers.Ground);

    if (!initialXY) {
      throw new Error(`❌ Failed to get first XY for ${map}`);
    }

    const offset = this.getMapOffset(initialXY[0], initialXY[1])!;
    const dimensions = this.mapTiles.getMapWidthHeight(map, offset.gridOffsetX, offset.gridOffsetY);

    dimens = {
      startX: initialXY[0],
      startY: initialXY[1],
      width: dimensions.width,
      height: dimensions.height,
    };

    this.gridDimensions.set(map, dimens);

    return dimens;
  }

  private getMapOffset(initialX: number, initialY: number): { gridOffsetX: number; gridOffsetY: number } | undefined {
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

  public async findShortestPath(
    map: string,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): Promise<number[][] | undefined> {
    if (!this.mapHelper.areAllCoordinatesValid([startGridX, startGridY], [endGridX, endGridY])) {
      return;
    }

    return await this.findShortestPathBetweenPoints(map, {
      start: {
        x: startGridX,
        y: startGridY,
      },
      end: {
        x: endGridX,
        y: endGridY,
      },
    });
  }

  private async findShortestPathBetweenPoints(
    map: string,
    gridCourse: IGridCourse,
    retries?: number
  ): Promise<number[][]> {
    if (!retries) {
      retries = 0;
    }

    const data = await this.generateGridBetweenPoints(map, gridCourse);
    const grid = data.grid;

    // translate co-ordinates to sub grid co-ordinates
    const firstNode = { x: gridCourse.start.x - data.startX, y: gridCourse.start.y - data.startY };
    const lastNode = { x: gridCourse.end.x - data.startX, y: gridCourse.end.y - data.startY };

    grid.setWalkableAt(firstNode.x, firstNode.y, true);
    grid.setWalkableAt(lastNode.x, lastNode.y, true);

    const finder = new PF.BestFirstFinder(); // way more efficient than AStar in CPU usage!
    const path = finder.findPath(firstNode.x, firstNode.y, lastNode.x, lastNode.y, grid);

    const pathWithoutOffset = path.map(([x, y]) => [x + data.startX, y + data.startY]);

    if (pathWithoutOffset.length < 1 && retries < 3) {
      gridCourse.offset = Math.pow(10, retries + 1);
      return this.findShortestPathBetweenPoints(map, gridCourse, ++retries);
    }

    return pathWithoutOffset;
  }

  private async generateGridBetweenPoints(map: string, gridCourse: IGridCourse): Promise<any> {
    const tree = await this.getGrid(map);
    if (!tree) {
      throw new Error(`❌ Could not find grid for map: ${map}`);
    }

    const dimens = this.getMapDimensions(map);
    const offset = this.getMapOffset(dimens.startX, dimens.startY)!;

    const bounds = this.getSubGridBounds(map, gridCourse);

    const toKey = (x: number, y: number): string => {
      return [x, y].join("-");
    };

    const solids: Map<string, boolean> = new Map();

    for (let y = bounds.startY + offset.gridOffsetY, yi = 0; yi < bounds.height; y++, yi++) {
      for (let x = bounds.startX + offset.gridOffsetX, xi = 0; xi < bounds.width; x++, xi++) {
        if (tree[y][x] === 1) {
          solids.set(toKey(x, y), true);
        }
      }
    }

    const matrix = this.generateMatrixBetweenPoints(
      bounds,
      (gridX, gridY) => !!solids.get(toKey(gridX + offset.gridOffsetX, gridY + offset.gridOffsetY))
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
      const bounds = this.getMapDimensions(map);

      const minX = bounds.startX;
      const minY = bounds.startY;
      const maxWidth = bounds.width;
      const maxHeight = bounds.height;

      const newX = startX - gridCourse.offset;
      const newY = startY - gridCourse.offset;

      startX = newX < minX ? minX : newX;
      startY = newY < minY ? minY : newY;

      const availableWidth = maxWidth - (startX + Math.abs(minX));
      const availableHeight = maxHeight - (startY + Math.abs(minY));

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
    const matrix: number[][] = [];

    for (let gridY = 0; gridY < bounds.height; gridY++) {
      for (let gridX = 0; gridX < bounds.width; gridX++) {
        matrix[gridY] = matrix[gridY] || [];

        const isWalkable = !isSolidFn(gridX + bounds.startX, gridY + bounds.startY);
        matrix[gridY][gridX] = isWalkable ? 0 : 1;
      }
    }

    if (!matrix.length) {
      throw new Error("Failed to generate pathfinding grid");
    }

    return matrix;
  }
}
