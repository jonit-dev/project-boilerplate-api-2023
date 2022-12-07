import {
  ITiledChunk,
  ITiledLayer,
  ITileset,
  MapLayers,
  MAP_LAYERS,
  MAP_LAYERS_TO_ID,
  TiledLayerNames,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MapLoader } from "./MapLoader";

@provide(MapTiles)
export class MapTiles {
  public getFirstXY(map: string, layerName: MapLayers): [number, number] | undefined {
    const layer = this.getLayer(map, layerName);

    if (!layer) {
      throw new Error(`Failed to find layer ${layerName}`);
    }

    const chunk = layer.chunks[0];

    if (!chunk) {
      return undefined;
    }

    return [chunk.x, chunk.y];
  }

  public getMapWidthHeight(
    map: string,
    layerName: MapLayers,
    gridOffsetX: number,
    gridOffsetY: number
  ): { width: number; height: number } {
    const mapData = MapLoader.maps.get(map);

    if (!mapData) {
      throw new Error(`Failed to find map ${map}`);
    }

    return {
      width: mapData.width + gridOffsetX,
      height: mapData.height + gridOffsetY,
    };
  }

  public isSolid(map: string, gridX: number, gridY: number, mapLayer: MapLayers): boolean {
    const areAllLayersTileEmpty = this.areAllLayersTileEmpty(map, gridX, gridY);

    if (areAllLayersTileEmpty) {
      return true;
    }

    // full solids are tiles with ge_collide_all. This means that regardless of the layer, the tile is solid.
    const isFullSolid = this.hasPropertyInAnyLayer(map, gridX, gridY, "ge_collide_all");

    if (isFullSolid) {
      return true;
    }

    const layer = this.getLayer(map, mapLayer);

    if (!layer) {
      return false;
    }

    const rawTileId = this.getRawTileId(layer, gridX, gridY);

    if (!rawTileId) {
      return false;
    }

    const targetTileset = this.getTilesetFromRawTileId(map, rawTileId!);

    if (!targetTileset) {
      return false;
    }

    if (rawTileId) {
      const tileId = rawTileId - targetTileset.firstgid;

      const tileProperty = this.getTileProperty<boolean>(targetTileset!, tileId!, "ge_collide") || false;

      if (tileProperty) {
        return tileProperty;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public isPassage(map: string, gridX: number, gridY: number, mapLayer: MapLayers): boolean {
    const layerName = TiledLayerNames[mapLayer];

    const layer = this.getLayer(map, mapLayer);

    if (!layer) {
      throw new Error(`Failed to find layer ${layerName}`);
    }

    const rawTileId = this.getRawTileId(layer, gridX, gridY);

    if (!rawTileId) {
      return false;
    }

    const targetTileset = this.getTilesetFromRawTileId(map, rawTileId!);

    if (!targetTileset) {
      return false;
    }

    if (rawTileId) {
      const tileId = rawTileId - targetTileset.firstgid;
      return this.getTileProperty<boolean>(targetTileset!, tileId!, "is_passage") || false;
    }

    return false;
  }

  public getPropertyFromLayer(
    map: string,
    gridX: number,
    gridY: number,
    mapLayer: MapLayers,
    property: string
  ): string | undefined {
    const layer = this.getLayer(map, mapLayer);

    if (!layer) {
      return;
    }

    const rawTileId = this.getRawTileId(layer, gridX, gridY);

    if (!rawTileId) {
      return;
    }

    const targetTileset = this.getTilesetFromRawTileId(map, rawTileId!);

    if (!targetTileset) {
      return;
    }

    if (rawTileId) {
      const tileId = rawTileId - targetTileset.firstgid;
      return this.getTileProperty<string>(targetTileset!, tileId!, property);
    }
  }

  public getTileProperty<T>(tileset: ITileset, tileId: number, tileProperty: string): T | undefined {
    const tileInfo = tileset?.tiles?.find((tile) => tile.id === tileId);

    if (!tileInfo) {
      return undefined;
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

  public getTileId(map: string, gridX: number, gridY: number, mapLayer: MapLayers): number | undefined {
    const layerName = TiledLayerNames[mapLayer];

    const layer = this.getLayer(map, mapLayer);

    if (!layer) {
      throw new Error(`Failed to find layer ${layerName}`);
    }

    // get tile at position x and y

    const rawTileId = this.getRawTileId(layer, gridX, gridY);

    const targetTileset = this.getTilesetFromRawTileId(map, rawTileId!);

    if (rawTileId) {
      const tileId = rawTileId! - targetTileset!.firstgid;

      return tileId;
    }
  }

  private hasPropertyInAnyLayer(map: string, gridX: number, gridY: number, property: string): boolean {
    for (const layer of MAP_LAYERS) {
      const tileProperty = this.getPropertyFromLayer(map, gridX, gridY, MAP_LAYERS_TO_ID[layer], property);

      if (tileProperty) {
        return true;
      }
    }

    return false;
  }

  private areAllLayersTileEmpty(map: string, gridX: number, gridY: number): boolean {
    for (const layer of MAP_LAYERS) {
      let tileId;

      try {
        tileId = this.getTileId(map, gridX, gridY, MAP_LAYERS_TO_ID[layer]);

        if (tileId === undefined) {
          continue;
        }
      } catch (error) {
        continue;
      }

      if (tileId >= 0) {
        return false;
      }
    }

    return true;
  }

  private isBitwise = (n: number): boolean => {
    return (n & 0x80000000) !== 0;
  };

  private convertBitewiseToTileId(bitewise: number): number {
    // more info here: https://discourse.mapeditor.org/t/need-help-understanding-exported-flipped-tiles/5383/3
    // and convert it to binary, where it returns this 30 bit binary number

    const binary = bitewise.toString(2);

    const clearedBinary = "0".repeat(4) + binary.substring(4, binary.length);

    // use cleared binary to get the tile id
    const tileId = parseInt(clearedBinary, 2);

    return tileId;
  }

  private getTargetChunk(chunks: ITiledChunk[], gridX: number, gridY: number): ITiledChunk | undefined {
    return chunks.find(
      (chunk) => chunk.x <= gridX && chunk.x + chunk.width > gridX && chunk.y <= gridY && chunk.y + chunk.height > gridY
    );
  }

  private getRawTileId(layer: ITiledLayer, gridX: number, gridY: number): number | undefined {
    const chunk = this.getTargetChunk(layer.chunks, gridX, gridY);

    if (!chunk) {
      return undefined;
    }

    let rawTileId = chunk.data[(gridY - chunk.y) * chunk.width + (gridX - chunk.x)];

    if (this.isBitwise(rawTileId)) {
      rawTileId = this.convertBitewiseToTileId(rawTileId);
    }

    return rawTileId;
  }

  private getLayer(map: string, layerName: MapLayers): ITiledLayer | undefined {
    const mapData = MapLoader.maps.get(map);

    if (!mapData) {
      throw new Error(`Failed to find map ${map}`);
    }

    return mapData.layers.find((layer) => layer.name.toLowerCase() === TiledLayerNames[layerName].toLowerCase());
  }
}
