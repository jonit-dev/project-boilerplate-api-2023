import { ITiled, MapLayers } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MapLoader } from "./MapLoader";
import { MapTiles } from "./MapTiles";

export interface ILayersSolidData {
  layer: number;
  isSolid: boolean;
}

@provide(MapSolids)
export class MapSolids {
  constructor(private mapTiles: MapTiles) {}

  public generateGridSolids(map: string, currentMap: ITiled): void {
    const gridMap = MapLoader.grids.get(map);
    if (!gridMap) {
      console.log(`❌ Failed to create grid for ${map}`);
      return;
    }

    //! Warning: If the server starts to crash with a undefined in setWalkable at, double check if your Tiled map width and height is right! If not, go to Map > Resize map

    for (let gridX = 0; gridX < currentMap.width; gridX++) {
      for (let gridY = 0; gridY < currentMap.height; gridY++) {
        const isSolid = this.isTileSolid(map, gridX, gridY, MapLayers.Character);

        gridMap.setWalkableAt(gridX, gridY, !isSolid);
      }
    }
  }

  public isTileSolid(
    map: string,
    gridX: number,
    gridY: number,
    layer: MapLayers,
    checkAllLayersBelow: boolean = true
  ): boolean {
    if (checkAllLayersBelow) {
      for (let i = layer; i >= MapLayers.Ground; i--) {
        const isSolid = this.tileSolidCheck(map, gridX, gridY, i);
        if (isSolid) {
          return true;
        }
      }
      return false;
    } else {
      return this.tileSolidCheck(map, gridX, gridY, layer);
    }
  }

  private tileSolidCheck(map: string, gridX: number, gridY: number, layer: MapLayers): boolean {
    return this.mapTiles.isSolid(map, gridX, gridY, layer);
  }
}
