import { provide } from "inversify-binding-decorators";
import { MapTiles } from "./MapTiles";

@provide(MapTransition)
export class MapTransition {
  constructor(private mapTiles: MapTiles) {}

  // public isTransitionAtXY(map: string, layer: MapLayers, gridX: number, gridY: number): boolean {}
}
