import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";

import { INPC } from "@entities/ModuleNPC/NPCModel";
import { appEnv } from "@providers/config/env";
import { provide } from "inversify-binding-decorators";
import PF from "pathfinding";
import { GridManager, IGridCourse } from "./GridManager";
import { MapHelper } from "./MapHelper";
import { PathfindingCaching } from "./PathfindingCaching";

@provide(Pathfinder)
export class Pathfinder {
  constructor(
    private mapHelper: MapHelper,
    private pathfindingCaching: PathfindingCaching,
    private inMemoryHashTable: InMemoryHashTable,
    private gridManager: GridManager
  ) {}

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

    return this.findShortestPathBetweenPoints(map, {
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

    const data = this.gridManager.generateGridBetweenPoints(map, gridCourse);
    const grid = data.grid;

    // translate co-ordinates to sub grid co-ordinates
    const firstNode = { x: gridCourse.start.x - data.startX, y: gridCourse.start.y - data.startY };
    const lastNode = { x: gridCourse.end.x - data.startX, y: gridCourse.end.y - data.startY };

    grid.setWalkableAt(firstNode.x, firstNode.y, true);
    grid.setWalkableAt(lastNode.x, lastNode.y, true);

    let finder;
    if (appEnv.general.IS_UNIT_TEST) {
      finder = new PF.BestFirstFinder(); // this is because our tests are setup with this one. This would avoid having to update the tests all the fucking time we decide for a new PF algorithm.
    } else {
      finder = new PF.BreadthFirstFinder(); // way more efficient than AStar in CPU usage!
    }

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
}
