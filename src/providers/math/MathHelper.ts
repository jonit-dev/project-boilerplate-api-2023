import { Direction } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import numberString from "number-string";

interface IPoint {
  x: number;
  y: number;
}

interface IRect {
  bottom: number;
  left: number;
  top: number;
  right: number;
}

@provide(MathHelper)
export class MathHelper {
  public addMultiplier(n: string): number {
    if (n.includes("B")) {
      return _.round(numberString.toNumber(n) * 1000000000, 2);
    }

    if (n.includes("M")) {
      return _.round(numberString.toNumber(n) * 1000000, 2);
    }

    if (n.includes("K")) {
      return _.round(numberString.toNumber(n) * 1000, 2);
    }

    return _.round(numberString.toNumber(n), 2);
  }

  public median(arr): number {
    const mid = Math.floor(arr.length / 2);
    const nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  }

  public weightedMean(arrValues: number[], arrWeights: number[]): number {
    const result = arrValues
      .map(function (value, i) {
        const weight = arrWeights[i];
        const sum = value * weight;

        return [sum, weight];
      })
      .reduce(
        function (p, c) {
          return [p[0] + c[0], p[1] + c[1]];
        },
        [0, 0]
      );

    return result[0] / result[1];
  }

  public getDistanceBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
    const y = x2 - x1;
    const x = y2 - y1;

    return Math.sqrt(x * x + y * y);
  }

  public isXYInsideRectangle(point: IPoint, rect: IRect): boolean {
    return point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom;
  }

  public getDirectionFromPoint(origin: IPoint, destination: IPoint): Direction {
    const xDiff = destination.x - origin.x;
    const yDiff = destination.y - origin.y;
  
    if (xDiff === 0 && yDiff === 0) {
      throw new Error("origin and destination are the same point");
    }
  
    if (xDiff === 0 && yDiff > 0) {
      return "down";
    } else if (xDiff === 0 && yDiff < 0) {
      return "up";
    } else if (yDiff === 0 && xDiff > 0) {
      return "right";
    } else if (yDiff === 0 && xDiff < 0) {
      return "left";
    } else if (yDiff > 0 && xDiff > 0) {
      return "down_right";
    } else if (yDiff < 0 && xDiff > 0) {
      return "up_right";
    } else if (yDiff > 0 && xDiff < 0) {
      return "down_left";
    } else {
      return "up_left";
    }
  }

  /**
   * Implements Bresenham algorithm to return an array of grid points that get crossed by a line between 2 points
   * (including start and end points)
   * @param start line starting point x and y coordinates
   * @param end line end point x and y coordinates
   * @returns array of crossed grid points
   */
  public getCrossedGridPoints(start: IPoint, end: IPoint): IPoint[] {
    const arr: IPoint[] = [];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    const sx = dx > 0 ? 1 : -1;
    const sy = dy > 0 ? 1 : -1;
    let eps = 0;

    if (adx > ady) {
      for (let x = start.x, y = start.y; sx < 0 ? x >= end.x : x <= end.x; x += sx) {
        eps += ady;
        arr.push({ x, y });
        if (eps << 1 >= adx) {
          y += sy;
          eps -= adx;
        }
      }
    } else {
      for (let x = start.x, y = start.y; sy < 0 ? y >= end.y : y <= end.y; y += sy) {
        eps += adx;
        arr.push({ x, y });
        if (eps << 1 >= ady) {
          x += sx;
          eps -= ady;
        }
      }
    }
    return arr;
  }

  /**
   * Gets circundating grid points of a specified point in the grid.
   * Negative coordinates are discarded
   * @param point base point to get the surrounding points from
   * @param delta radial distance from the point
   * @returns array of surrounding grid points for the delta specified
   */
  public getCircundatingGridPoints(point: IPoint, delta: number): IPoint[] {
    const arr: IPoint[] = [];
    for (let dx = -delta; dx <= delta; dx++) {
      for (let dy = delta; dy >= -delta; dy--) {
        // do not include base point
        if (dx === 0 && dy === 0) {
          continue;
        }
        const candidate: IPoint = { x: point.x + dx, y: point.y + dy };
        // if x or y coordinates are negative, dont include this point
        if (candidate.x < 0 || candidate.y < 0) {
          continue;
        }
        arr.push(candidate);
      }
    }

    return arr;
  }

  public fixPrecision(num: number): number {
    return Math.round(num * 100 + Number.EPSILON) / 100;
  }
}
