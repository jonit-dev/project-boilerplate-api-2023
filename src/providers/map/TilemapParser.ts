import { MapSolid } from "@entities/ModuleSystem/MapSolid";
import { STATIC_PATH } from "@providers/constants/PathConstants";
import { ITiled, ITileset, MapLayers, TiledLayerNames } from "@rpg-engine/shared";
import crypto from "crypto";
import fs from "fs";
import { provide } from "inversify-binding-decorators";
import PF from "pathfinding";

@provide(TilemapParser)
export class TilemapParser {
  public static maps: Map<string, ITiled> = new Map();
  public static grids: Map<string, PF.Grid> = new Map();

  constructor() {}

  public init(): void {
    // get all map names

    const mapNames = fs.readdirSync(STATIC_PATH + "/maps");

    for (const mapFileName of mapNames) {
      if (mapFileName.includes("_hash")) {
        continue; // just cache files, skip!
      }

      if (!mapFileName.endsWith(".json")) {
        continue;
      }
      const mapPath = `${STATIC_PATH}/maps/${mapFileName}`;

      const currentMap = JSON.parse(fs.readFileSync(mapPath, "utf8")) as unknown as ITiled;
      const mapName = mapFileName.replace(".json", "");

      TilemapParser.maps.set(mapName, currentMap);

      TilemapParser.grids.set(mapName, new PF.Grid(currentMap.width, currentMap.height));

      this.generateSolidsMapAndGrid(mapName, currentMap);
    }

    console.log("📦 Maps and grids are loaded!");
  }

  public async generateSolidsMapAndGrid(map: string, currentMap: ITiled): Promise<void> {
    const gridMap = TilemapParser.grids.get(map);
    if (!gridMap) {
      console.log(`❌ Failed to create grid for ${map}`);
      return;
    }

    const mapLayerParser = {
      ground: 0,
      "over-ground": 1,
      player: 2,
      "over-player": 3,
    };

    let shouldGenerateSolids;

    if (this.wasMapModified(map, currentMap)) {
      console.log(`⚙️ The map ${map} was modified. Regenerating solids into our database... ✅`);
      // only generate solids again in the database, if there was a map change!
      shouldGenerateSolids = true;
    } else {
      console.log(`⚙️ The map ${map} is already updated in our database. Skipping solids generation...`);
      shouldGenerateSolids = false;
    }

    for (let gridX = 0; gridX < currentMap.width; gridX++) {
      for (let gridY = 0; gridY < currentMap.height; gridY++) {
        const layers = currentMap.layers;

        for (const layer of layers) {
          const isSolid = this.isSolid(map, gridX, gridY, mapLayerParser[layer.name]);
          const isSolidOnlyThisLayer = this.isSolid(map, gridX, gridY, mapLayerParser[layer.name], false);

          if (mapLayerParser[layer.name] === MapLayers.Player) {
            gridMap.setWalkableAt(gridX, gridY, !isSolid);
          }

          // create solids map for quick access

          if (shouldGenerateSolids) {
            const hasStoredSolid = await MapSolid.exists({ map, layer: mapLayerParser[layer.name], gridX, gridY });

            if (hasStoredSolid) {
              await MapSolid.updateOne(
                { map, layer: mapLayerParser[layer.name], gridX, gridY },
                {
                  $set: {
                    isSolidThisLayerAndBelow: isSolid,
                    isSolidOnlyThisLayer: isSolidOnlyThisLayer,
                  },
                }
              );
            } else {
              const solid = new MapSolid({
                map,
                layer: mapLayerParser[layer.name],
                gridX,
                gridY,
                isSolidThisLayerAndBelow: isSolid,
                isSolidOnlyThisLayer,
              });

              await solid.save();
            }
          }
        }
      }
    }
  }

  private wasMapModified(mapName: string, currentMap: ITiled): boolean {
    if (!fs.existsSync(`${STATIC_PATH}/maps/${mapName}_hash.json`)) {
      const mapHash = crypto.createHash("sha256").update(JSON.stringify(currentMap)).digest("hex");
      fs.writeFileSync(
        `${STATIC_PATH}/maps/${mapName}_hash.json`,
        JSON.stringify({
          hash: mapHash,
        })
      );
    } else {
      // if file exists, lets check if there was some map change!
      const mapHash = crypto.createHash("sha256").update(JSON.stringify(currentMap)).digest("hex");
      const savedHash = fs.readFileSync(`${STATIC_PATH}/maps/${mapName}_hash.json`, "utf8");

      const { hash: parsedHash } = JSON.parse(savedHash);

      if (mapHash !== parsedHash) {
        fs.writeFileSync(
          `${STATIC_PATH}/maps/${mapName}_hash.json`,
          JSON.stringify({
            hash: mapHash,
          })
        ); // update to our current hash

        return true;
      }
    }

    return false;
  }

  private isSolid(
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
    const tileId = this.getTileId(map, gridX, gridY, layer);

    if (tileId === 0 || !tileId) {
      return false; // 0 means it's empty
    }

    const mapData = TilemapParser.maps.get(map);

    if (!mapData) {
      throw new Error(`Failed to find map ${map}`);
    }

    const tileset = mapData.tilesets.find((tileset) => tileId <= tileset.tilecount);

    if (!tileset) {
      throw new Error(`Failed to find tileset for tile ${tileId}`);
    }

    const isTileSolid = this.getTileProperty<boolean>(tileset, tileId, "ge_collide");

    if (!isTileSolid) {
      return false;
    }

    return isTileSolid;
  }

  private getTileProperty<T>(tileset: ITileset, tileId: number, tileProperty: string): T | undefined {
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

  private getTileId(map: string, gridX: number, gridY: number, mapLayer: MapLayers): number | undefined {
    const layerName = TiledLayerNames[mapLayer];

    const mapData = TilemapParser.maps.get(map);

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
