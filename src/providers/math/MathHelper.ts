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
}
