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

    return xDiff === 0 && yDiff > 0
      ? "down"
      : xDiff === 0 && yDiff < 0
      ? "up"
      : yDiff === 0 && xDiff > 0
      ? "right"
      : yDiff === 0 && xDiff < 0
      ? "left"
      : yDiff > 0 && xDiff > 0
      ? "down_right"
      : yDiff < 0 && xDiff > 0
      ? "up_right"
      : yDiff > 0 && xDiff < 0
      ? "down_left"
      : "up_left";
  }
}
