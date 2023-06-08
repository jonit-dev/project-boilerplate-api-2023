import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { MapLayers } from "@rpg-engine/shared";
import PF from "pathfinding";
import { MapHelper } from "./MapHelper";
import { MapSolids } from "./MapSolids";
import { MapTiles } from "./MapTiles";
import { PathfindingCaching } from "./PathfindingCaching";

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

  constructor(
    private mapTiles: MapTiles,
    private mapSolids: MapSolids,
    private mapHelper: MapHelper,
    private pathfindingCaching: PathfindingCaching,
    private inMemoryHashTable: InMemoryHashTable,
    private newRelic: NewRelic
  ) {}

  public getGrid(map: string): number[][] {
    return this.grids.get(map)!;
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

    const initialXY = this.mapTiles.getFirstXY(map);

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
    npc: INPC,
    map: string,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): Promise<number[][] | undefined> {
    if (!this.mapHelper.areAllCoordinatesValid([startGridX, startGridY], [endGridX, endGridY])) {
      return;
    }

    const cachedShortestPath = await this.pathfindingCaching.get(map, {
      start: {
        x: startGridX,
        y: startGridY,
      },
      end: {
        x: endGridX,
        y: endGridY,
      },
    });

    const cachedNextStep = cachedShortestPath?.[0];

    const hasCircularRef = await this.hasCircularReferenceOnPathfinding(
      npc,
      map,
      startGridX,
      startGridY,
      endGridX,
      endGridY,
      cachedNextStep!
    );

    if (cachedShortestPath?.length! > 0 && !hasCircularRef) {
      return cachedShortestPath as number[][];
    }

    let shortestPath;

    this.newRelic.trackTransaction(NewRelicTransactionCategory.Operation, "FindShortestPath/BestFirstFinder", () => {
      shortestPath = this.findShortestPathBetweenPoints(map, {
        start: {
          x: startGridX,
          y: startGridY,
        },
        end: {
          x: endGridX,
          y: endGridY,
        },
      });
    });

    return shortestPath;
  }

  private async hasCircularReferenceOnPathfinding(
    npc: INPC,
    map: string,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number,
    cachedNextStep: number[]
  ): Promise<boolean> {
    const previousNPCPosition = (await this.inMemoryHashTable.get("npc-previous-position", npc._id)) as number[];

    // if the next step is the same as the previous NPC position, then we can assume that the NPC is stuck and we should recalculate the path
    const hasCircularRef =
      cachedNextStep &&
      previousNPCPosition &&
      cachedNextStep[0] === previousNPCPosition[0] &&
      cachedNextStep[1] === previousNPCPosition[1];
    if (hasCircularRef) {
      await this.pathfindingCaching.delete(map, {
        start: {
          x: startGridX,
          y: startGridY,
        },
        end: {
          x: endGridX,
          y: endGridY,
        },
      });

      return true;
    }

    return false;
  }

  private async findShortestPathBetweenPoints(
    map: string,
    gridCourse: IGridCourse,
    retries?: number
  ): Promise<number[][]> {
    if (!retries) {
      retries = 0;
    }

    const data = this.generateGridBetweenPoints(map, gridCourse);
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

    const nextStep = pathWithoutOffset[1];

    if (nextStep?.length) {
      await this.pathfindingCaching.set(
        map,

        {
          start: {
            x: gridCourse.start.x,
            y: gridCourse.start.y,
          },
          end: {
            x: gridCourse.end.x,
            y: gridCourse.end.y,
          },
        },
        [nextStep]
      );
    }

    return pathWithoutOffset;
  }

  private generateGridBetweenPoints(map: string, gridCourse: IGridCourse): any {
    const tree = this.getGrid(map);
    if (!tree) {
      throw new Error(`❌ Could not find grid for map: ${map}`);
    }

    const dimens = this.getMapDimensions(map);
    const offset = this.getMapOffset(dimens.startX, dimens.startY)!;

    const bounds = this.getSubGridBounds(map, gridCourse);

    const solids = new Set();

    for (let y = bounds.startY + offset.gridOffsetY; y < bounds.startY + bounds.height + offset.gridOffsetY; y++) {
      for (let x = bounds.startX + offset.gridOffsetX; x < bounds.startX + bounds.width + offset.gridOffsetX; x++) {
        if (tree[y][x] === 1) {
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
      const mapDimens = this.getMapDimensions(map);

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
