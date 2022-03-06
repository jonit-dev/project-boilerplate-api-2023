import { STATIC_PATH } from "@providers/constants/PathConstants";
import { MapLayers } from "@rpg-engine/shared";
import fs from "fs";
import { provide } from "inversify-binding-decorators";
import { IGetTileXYResult, ITiled, LayerNames } from "./TiledTypes";

@provide(TilemapParser)
export class TilemapParser {
  private tileWidth = 32;
  private tileHeight = 32;
  private tileCount = 740;
  private columns = 20;
  private imageWidth = 671;
  private imageHeight = 1203;
  private worldWidth = 3200;
  private worldHeight = 3200;
  private tilesPerRow = this.worldWidth / this.tileWidth;

  private map: ITiled;

  constructor() {}

  public init(mapName: string, tilesetName: string): void {
    const mapPath = `${STATIC_PATH}/maps/${mapName}.json`;

    const currentMap = JSON.parse(fs.readFileSync(mapPath, "utf8")) as unknown as ITiled;

    this.map = currentMap;

    const tileset = currentMap.tilesets.find((tileset) => tileset.name === tilesetName);

    if (!tileset) {
      throw new Error(`Failed to load tilet ${tilesetName} on ${mapName}.json`);
    }
  }

  public isSolid(x: number, y: number, layer: MapLayers): boolean {
    // TODO: Implement this
    return true;
  }

  private getTileXY(index: number): IGetTileXYResult {
    //! this is not working properly yet
    const x = Math.floor(index % this.tilesPerRow) - 1;
    const y = Math.floor(index / this.tilesPerRow);

    return { x, y };
  }

  private getTileId(x: number, y: number, layerData: number[]): number {
    // slice the sample array into a multidimensional array, each row containing maximum of tilesPerRow
    const slicedTiles = layerData.reduce((acc: number[][], cur, index) => {
      const row = Math.floor(index / this.tilesPerRow);

      if (!acc[row]) {
        acc[row] = [];
      }

      acc[row].push(cur);

      return acc;
    }, []);

    const tileId = slicedTiles[y][x] - 1;

    console.log(`TileId: ${tileId} - X: ${x} - Y: ${y}`);

    return tileId;
  }

  private getLayerData(layer: MapLayers): number[] {
    const layerName = LayerNames[layer];

    const layerInfo = this.map.layers.find((layer) => layer.name.toLowerCase() === layerName.toLowerCase());

    if (!layerInfo) {
      throw new Error(`Failed to find layer ${layerName}`);
    }

    const layerData: number[] = [];

    for (const chunk of layerInfo.chunks) {
      layerData.push(...chunk.data);
    }

    return layerData;
  }
}
