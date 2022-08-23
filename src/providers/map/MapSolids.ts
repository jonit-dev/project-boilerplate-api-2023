import { MapLayers } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MapHelper } from "./MapHelper";
import { MapTiles } from "./MapTiles";

export interface ILayersSolidData {
  layer: number;
  isSolid: boolean;
}

export type SolidCheckStrategy =
  | "CHECK_ALL_LAYERS_BELOW"
  | "CHECK_SINGLE_LAYER"
  | "CHECK_ALL_LAYERS_ABOVE"
  | "CHECK_ALL_LAYERS";

@provide(MapSolids)
export class MapSolids {
  constructor(private mapTiles: MapTiles, private mapHelper: MapHelper) {}

  public isTileSolid(
    map: string,
    gridX: number,
    gridY: number,
    layer: MapLayers,
    strategy: SolidCheckStrategy = "CHECK_ALL_LAYERS_BELOW"
  ): boolean {
    switch (strategy) {
      case "CHECK_ALL_LAYERS":
        for (let i = this.mapHelper.getHighestMapLayer(); i >= 0; i--) {
          const isSolid = this.tileSolidCheck(map, gridX, gridY, i);
          if (isSolid) {
            return true;
          }
        }
        break;

      case "CHECK_ALL_LAYERS_BELOW":
        for (let i = layer; i >= MapLayers.Ground; i--) {
          const isSolid = this.tileSolidCheck(map, gridX, gridY, i);
          if (isSolid) {
            return true;
          }
        }
        break;
      case "CHECK_ALL_LAYERS_ABOVE":
        for (let i = layer; i <= this.mapHelper.getHighestMapLayer(); i++) {
          const isSolid = this.tileSolidCheck(map, gridX, gridY, i);
          if (isSolid) {
            return true;
          }
        }
        break;
      case "CHECK_SINGLE_LAYER":
      default:
        return this.tileSolidCheck(map, gridX, gridY, layer);
    }

    return false;
  }

  private tileSolidCheck(map: string, gridX: number, gridY: number, layer: MapLayers): boolean {
    return this.mapTiles.isSolid(map, gridX, gridY, layer);
  }
}
