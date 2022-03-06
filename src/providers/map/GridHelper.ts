import { GRID_HEIGHT, GRID_WIDTH } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

interface IGridPosition {
  gridX: number;
  gridY: number;
}

@provide(GridHelper)
export class GridHelper {
  public getGridXY(x: number, y: number): IGridPosition {
    return {
      gridX: Math.floor(x / GRID_WIDTH),
      gridY: Math.floor(y / GRID_HEIGHT),
    };
  }
}

export const ToGridX = (x: number): number => Math.floor(x / GRID_WIDTH);
export const ToGridY = (y: number): number => Math.floor(y / GRID_HEIGHT);

export const FromGridX = (gridX: number): number => gridX * GRID_WIDTH;
export const FromGridY = (gridY: number): number => gridY * GRID_HEIGHT;
