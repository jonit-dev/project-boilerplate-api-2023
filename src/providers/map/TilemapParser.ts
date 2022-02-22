import { provide } from "inversify-binding-decorators";

interface IGetTileXYResult {
  x: number;
  y: number;
}

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

  public getTileXY(index: number): IGetTileXYResult {
    //! this is not working properly yet
    const x = Math.floor(index % this.tilesPerRow) - 1;
    const y = Math.floor(index / this.tilesPerRow);

    return { x, y };
  }

  public getTileId(x: number, y: number, layerData: number[]): number {
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
}
