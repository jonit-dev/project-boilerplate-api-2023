import { ITiled, MapLayers, MAP_LAYERS_TO_ID, MAP_OBJECT_LAYERS } from "@rpg-engine/shared";
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

    for (let gridX = 0; gridX < currentMap.width; gridX++) {
      for (let gridY = 0; gridY < currentMap.height; gridY++) {
        const layers = currentMap.layers;

        for (const layer of layers) {
          if (MAP_OBJECT_LAYERS.includes(layer.name)) {
            // skip object layers, because this is just for solid generation
            continue;
          }

          const isSolid = this.isTileSolid(map, gridX, gridY, MAP_LAYERS_TO_ID[layer.name]);

          if (MAP_LAYERS_TO_ID[layer.name] === MapLayers.Character) {
            gridMap.setWalkableAt(gridX, gridY, !isSolid);
          }
        }
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
