import { MathHelper } from "@providers/math/MathHelper";
import { AnimationDirection, GRID_HEIGHT, GRID_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

interface IPosition {
  x: number;
  y: number;
}

@provide(MovementHelper)
export class MovementHelper {
  constructor(private mathHelper: MathHelper) {}

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
