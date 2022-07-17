import { MAP_LAYERS_TO_ID, MAP_OBJECT_LAYERS } from "@providers/constants/MapConstants";
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
    const tileId = this.mapTiles.getTileId(map, gridX, gridY, layer);

    if (tileId === 0 || !tileId) {
      return false; // 0 means it's empty
    }

    const mapData = MapLoader.maps.get(map);

    if (!mapData) {
      throw new Error(`Failed to find map ${map}`);
    }

    const tileset = mapData.tilesets.find((tileset) => tileId <= tileset.tilecount);

    if (!tileset) {
      throw new Error(`Failed to find tileset for tile ${tileId}`);
    }

    const isTileSolid = this.mapTiles.getTileProperty<boolean>(tileset, tileId, "ge_collide");

    if (!isTileSolid) {
      return false;
    }

    return isTileSolid;
  }
}
