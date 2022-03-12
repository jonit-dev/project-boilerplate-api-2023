import { TilemapParser } from "@providers/map/TilemapParser";
import { MathHelper } from "@providers/math/MathHelper";
import { AnimationDirection, GRID_HEIGHT, GRID_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import PF from "pathfinding";
interface IPosition {
  x: number;
  y: number;
}

@provide(MovementHelper)
export class MovementHelper {
  constructor(private mathHelper: MathHelper) {}

  public findShortestPath(
    map: string,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): number[][] | undefined {
    if (!TilemapParser.grids.has(map)) {
      console.log(`Failed to find grid for ${map}`);
    } else {
      const tempGrid = TilemapParser.grids.get(map)!.clone(); // should be cloned, otherwise it will be modified by the finder!

      const finder = new PF.AStarFinder();
      const path = finder.findPath(startGridX, startGridY, endGridX, endGridY, tempGrid!);

      return path;
    }
  }

  public isMovementUnderRange(
    initialX: number,
    initialY: number,
    newX: number,
    newY: number,
    maxRangeInGridCells: number
  ): boolean {
    const distance = this.mathHelper.getDistanceBetweenPoints(initialX, initialY, newX, newY);

    return distance < maxRangeInGridCells;
  }

  public calculateNewPositionXY(x: number, y: number, moveToDirection: AnimationDirection): IPosition {
    switch (moveToDirection) {
      case "down":
        return {
          x,
          y: y + GRID_HEIGHT,
        };
      case "up":
        return {
          x,
          y: y - GRID_HEIGHT,
        };
      case "left":
        return {
          x: x - GRID_WIDTH,
          y,
        };
      case "right":
        return {
          x: x + GRID_WIDTH,
          y,
        };
    }
  }

  public getOppositeDirection(direction: AnimationDirection): AnimationDirection {
    switch (direction) {
      case "down":
        return "up";
      case "up":
        return "down";
      case "left":
        return "right";
      case "right":
        return "left";
    }
  }
}
