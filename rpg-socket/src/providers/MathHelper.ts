import { provide } from "inversify-binding-decorators";

interface Point {
  x: number;
  y: number;
}

interface Rect {
  bottom: number;
  left: number;
  top: number;
  right: number;
}

@provide(MathHelper)
export class MathHelper {
  public getDistanceBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
    let y = x2 - x1;
    let x = y2 - y1;

    return Math.sqrt(x * x + y * y);
  }

  public isXYInsideRectangle(point: Point, rect: Rect): boolean {
    return point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom;
  }
}
