import { ITileset, MapLayers, TiledLayerNames } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MapLoader } from "./MapLoader";

@provide(MapTiles)
export class MapTiles {
  public getTileProperty<T>(tileset: ITileset, tileId: number, tileProperty: string): T | undefined {
    const tileInfo = tileset.tiles.find((tile) => tile.id === tileId);

    if (!tileInfo) {
      throw new Error(`Failed to find tile ${tileId}`);
    }

    const property = tileInfo.properties.find((property) => property.name === tileProperty);

    if (!property) {
      return undefined;
    }

    return property.value as unknown as T;
  }

  public getTileId(map: string, gridX: number, gridY: number, mapLayer: MapLayers): number | undefined {
    const layerName = TiledLayerNames[mapLayer];

    const mapData = MapLoader.maps.get(map);

    if (!mapData) {
      throw new Error(`Failed to find map ${map}`);
    }

    const layer = mapData.layers.find((layer) => layer.name.toLowerCase() === layerName.toLowerCase());

    if (!layer) {
      throw new Error(`Failed to find layer ${layerName}`);
    }

    const targetChunk = layer.chunks.find(
      (chunk) => chunk.x <= gridX && chunk.x + chunk.width > gridX && chunk.y <= gridY && chunk.y + chunk.height > gridY
    );

    // get tile at position x and y

    if (targetChunk) {
      const tileId = targetChunk.data[(gridY - targetChunk.y) * targetChunk.width + (gridX - targetChunk.x)];

      if (tileId) {
        return tileId - 1;
      } else {
        return 0;
      }
    }
  }
}
