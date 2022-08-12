import { ITiled, MapLayers } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MapHelper } from "./MapHelper";
import { MapLoader } from "./MapLoader";
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

  public generateGridSolids(map: string, currentMap: ITiled): void {
    const gridMap = MapLoader.grids.get(map);
    if (!gridMap) {
      console.log(`❌ Failed to create grid for ${map}`);
      return;
    }

    //! Warning: If the server starts to crash with a undefined in setWalkable at, double check if your Tiled map width and height is right! If not, go to Map > Resize map

    for (let gridX = 0; gridX < currentMap.width; gridX++) {
      for (let gridY = 0; gridY < currentMap.height; gridY++) {
        try {
          const isSolid = this.isTileSolid(map, gridX, gridY, MapLayers.Character);
          gridMap.setWalkableAt(gridX, gridY, !isSolid);
        } catch (error) {
          console.log(
            "❌ Failed to set walkable for map",
            map,
            " at ",
            gridX,
            gridY,
            error,
            "Please double check in Tiled if all of your ge_collide properties are set."
          );
        }
      }
    }
  }

  public isTileSolid(
    map: string,
    gridX: number,
    gridY: number,
    layer: MapLayers,
    strategy: SolidCheckStrategy = "CHECK_ALL_LAYERS"
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
