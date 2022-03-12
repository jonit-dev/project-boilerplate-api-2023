import { AnimationDirection, GRID_HEIGHT, GRID_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

interface IPosition {
  x: number;
  y: number;
}

@provide(MovementHelper)
export class MovementHelper {
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
}
