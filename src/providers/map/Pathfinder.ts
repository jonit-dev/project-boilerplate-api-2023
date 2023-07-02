import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";

import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { appEnv } from "@providers/config/env";
import { MathHelper } from "@providers/math/MathHelper";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { GRID_WIDTH, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { minBy } from "lodash";
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
    private gridManager: GridManager,

    private mathHelper: MathHelper,
    private movementHelper: MovementHelper
  ) {}

  @TrackNewRelicTransaction()
  public async findShortestPath(
    npc: INPC,
    target: ICharacter | null,
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

    const previousNPCPosition = (await this.inMemoryHashTable.get("npc-previous-position", npc._id)) as number[];

    const hasCircularRef = await this.hasCircularReferenceOnPathfinding(
      npc,
      map,
      startGridX,
      startGridY,
      endGridX,
      endGridY,
      cachedNextStep!,
      previousNPCPosition
    );

    if (cachedShortestPath?.length! > 0 && !hasCircularRef) {
      return cachedShortestPath as number[][];
    }

    const hasForcedPathfindingCalculation = await this.inMemoryHashTable.get(
      "npc-force-pathfinding-calculation",
      npc._id
    );

    if (!hasForcedPathfindingCalculation && target) {
      const isUnderRange = this.movementHelper.isUnderRange(npc.x, npc.y, target.x, target.y, 2);

      if (!isUnderRange) {
        const nearestGridToTarget = await this.getNearestGridToTarget(npc, target.x, target.y, previousNPCPosition);

        if (nearestGridToTarget?.length) {
          return nearestGridToTarget;
        }
      }
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

  @TrackNewRelicTransaction()
  private async getNearestGridToTarget(
    npc: INPC,
    targetX: number,
    targetY: number,
    previousNPCPosition: number[]
  ): Promise<number[][]> {
    const potentialPositions = [
      {
        direction: "top",
        x: npc.x,
        y: npc.y - GRID_WIDTH,
      },
      {
        direction: "bottom",
        x: npc.x,
        y: npc.y + GRID_WIDTH,
      },
      {
        direction: "left",
        x: npc.x - GRID_WIDTH,
        y: npc.y,
      },
      {
        direction: "right",
        x: npc.x + GRID_WIDTH,
        y: npc.y,
      },
    ];

    const nonSolidPositions: {
      direction: string;
      x: number;
      y: number;
    }[] = [];

    for (const data of potentialPositions) {
      const isSolid = await this.movementHelper.isSolid(
        npc.scene,
        ToGridX(data.x),
        ToGridX(data.y),
        npc.layer,
        "CHECK_ALL_LAYERS_BELOW"
      );

      if (!isSolid) {
        nonSolidPositions.push(data);
      }
    }

    // Now we check for the direction of the target relative to the NPC
    const dx = targetX - npc.x;
    const dy = targetY - npc.y;

    const targetDirection = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "bottom" : "top";

    // First, we try to find a non-solid position in the direction of the target
    const targetDirectionPosition = nonSolidPositions.find((pos) => pos.direction === targetDirection);

    if (targetDirectionPosition) {
      // if the next step is the same as the previous NPC position, then we can assume that the NPC is stuck and we should recalculate the path
      if (
        previousNPCPosition &&
        previousNPCPosition[0] === ToGridX(targetDirectionPosition.x) &&
        previousNPCPosition[1] === ToGridY(targetDirectionPosition.y)
      ) {
        await this.inMemoryHashTable.set("npc-force-pathfinding-calculation", npc._id, true);
        return [];
      }

      return [[ToGridX(targetDirectionPosition.x), ToGridY(targetDirectionPosition.y)]];
    }

    // If there is no non-solid position in the direction of the target, we default to your previous approach
    const results: {
      distance: number;
      direction: string;
      x: number;
      y: number;
    }[] = [];

    for (const data of nonSolidPositions) {
      const distanceToPosition = this.mathHelper.getDistanceBetweenPoints(data.x, data.y, targetX, targetY);

      results.push({
        distance: distanceToPosition,
        direction: data.direction,
        x: data.x,
        y: data.y,
      });
    }

    const minDistance = minBy(results, "distance");

    // if the next step is the same as the previous NPC position, then we can assume that the NPC is stuck and we should recalculate the path
    if (
      previousNPCPosition &&
      ToGridX(minDistance?.x!) === previousNPCPosition[0] &&
      ToGridY(minDistance?.y!) === previousNPCPosition[1]
    ) {
      await this.inMemoryHashTable.set("npc-force-pathfinding-calculation", npc._id, true);
      return [];
    }

    return [[ToGridX(minDistance!.x), ToGridY(minDistance!.y)]];
  }

  private async hasCircularReferenceOnPathfinding(
    npc: INPC,
    map: string,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number,
    cachedNextStep: number[],
    previousNPCPosition: number[]
  ): Promise<boolean> {
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
