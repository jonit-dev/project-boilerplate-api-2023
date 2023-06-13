import { provide } from "inversify-binding-decorators";
import { IGridBounds } from "./GridManager";
import { MapTiles } from "./MapTiles";

@provide(MapProperties)
export class MapProperties {
  private gridDimensions: Map<string, IGridBounds> = new Map();

  constructor(private mapTiles: MapTiles) {}

  public getMapDimensions(map: string, calculate?: boolean): IGridBounds {
    let dimens = !calculate ? this.gridDimensions.get(map) : null;
    if (dimens) {
      return dimens;
    }

    const initialXY = this.mapTiles.getFirstXY(map);

    if (!initialXY) {
      throw new Error(`❌ Failed to get first XY for ${map}`);
    }

    const offset = this.getMapOffset(initialXY[0], initialXY[1])!;
    const dimensions = this.mapTiles.getMapWidthHeight(map, offset.gridOffsetX, offset.gridOffsetY);

    dimens = {
      startX: initialXY[0],
      startY: initialXY[1],
      width: dimensions.width,
      height: dimensions.height,
    };

    this.gridDimensions.set(map, dimens);

    return dimens;
  }

  public getMapOffset(initialX: number, initialY: number): { gridOffsetX: number; gridOffsetY: number } | undefined {
    let gridOffsetX = 0;
    let gridOffsetY = 0;

    if (initialX < 0) {
      gridOffsetX = Math.abs(initialX);
    }
    if (initialY < 0) {
      gridOffsetY = Math.abs(initialY);
    }

    return {
      gridOffsetX,
      gridOffsetY,
    };
  }
}
