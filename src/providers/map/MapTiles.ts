import { ITiledChunk, ITiledLayer, ITileset, MapLayers, TiledLayerNames } from "@rpg-engine/shared";
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

  public getTilesetFromRawTileId(map: string, rawTileId: number): ITileset | undefined {
    const mapData = MapLoader.maps.get(map);

    if (!mapData) {
      throw new Error(`Failed to find map ${map}`);
    }

    return mapData.tilesets.find(
      (tileset) => tileset.firstgid <= rawTileId && tileset.firstgid + tileset.tilecount > rawTileId
    );
  }

  public getLayer(map: string, layerName: MapLayers): ITiledLayer | undefined {
    const mapData = MapLoader.maps.get(map);

    if (!mapData) {
      throw new Error(`Failed to find map ${map}`);
    }

    return mapData.layers.find((layer) => layer.name.toLowerCase() === TiledLayerNames[layerName].toLowerCase());
  }

  public getTileId(map: string, gridX: number, gridY: number, mapLayer: MapLayers): number | undefined {
    const layerName = TiledLayerNames[mapLayer];

    const layer = this.getLayer(map, mapLayer);

    if (!layer) {
      throw new Error(`Failed to find layer ${layerName}`);
    }

    const targetChunk = this.getTargetChunk(layer.chunks, gridX, gridY);

    // get tile at position x and y

    if (targetChunk) {
      const rawTileId = this.getRawTileId(targetChunk, gridX, gridY);

      const targetTileset = this.getTilesetFromRawTileId(map, rawTileId!);

      if (rawTileId) {
        return rawTileId - targetTileset?.firstgid!;
      } else {
        return 0;
      }
    }
  }

  private getTargetChunk(chunks: ITiledChunk[], gridX: number, gridY: number): ITiledChunk | undefined {
    return chunks.find(
      (chunk) => chunk.x <= gridX && chunk.x + chunk.width > gridX && chunk.y <= gridY && chunk.y + chunk.height > gridY
    );
  }

  private getRawTileId(chunk: ITiledChunk, gridX: number, gridY: number): number | undefined {
    return chunk.data[(gridY - chunk.y) * chunk.width + (gridX - chunk.x)];
  }
}
