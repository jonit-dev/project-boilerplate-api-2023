import { MapModel } from "@entities/ModuleSystem/MapModel";
import { STATIC_PATH } from "@providers/constants/PathConstants";
import { InternalServerError } from "@providers/errors/InternalServerError";
import { ITiled, MapLayers, MAP_REQUIRED_LAYERS } from "@rpg-engine/shared";
import fs from "fs";
import { provide } from "inversify-binding-decorators";
import md5File from "md5-file";
import PF from "pathfinding";
import { createZipMap } from "./MapCompressionHelper";
import { MapObjectsLoader } from "./MapObjectsLoader";
import { MapSolids } from "./MapSolids";
import { MapTiles } from "./MapTiles";

type MapObject = {
  name: string;
  data: ITiled;
};

@provide(MapLoader)
export class MapLoader {
  public static maps: Map<string, ITiled> = new Map();
  public static grids: Map<string, PF.Grid> = new Map();
  constructor(private mapSolidsManager: MapSolids, private mapObjectsLoader: MapObjectsLoader) {}

  public async init(): Promise<void> {
    // get all map names

    const mapNames = fs.readdirSync(STATIC_PATH + "/maps");
    const mapToCheckTransitions: MapObject[] = [];

    for (const mapFileName of mapNames) {
      if (mapFileName.includes("_hash")) {
        continue; // just cache files, skip!
      }

      if (!mapFileName.endsWith(".json")) {
        continue;
      }

      const mapPath = `${STATIC_PATH}/maps/${mapFileName}`;
      const currentMap = JSON.parse(fs.readFileSync(mapPath, "utf8")) as unknown as ITiled;

      if (currentMap) {
        this.hasMapRequiredLayers(mapFileName, currentMap as ITiled);
      }

      const updated = await this.checkMapUpdated(mapPath, mapFileName, currentMap);

      if (updated) {
        mapToCheckTransitions.push({ name: mapFileName, data: currentMap });
      }

      const mapName = mapFileName.replace(".json", "");

      MapLoader.maps.set(mapName, currentMap);
      MapLoader.grids.set(mapName, new PF.Grid(currentMap.width, currentMap.height));

      this.mapSolidsManager.generateGridSolids(mapName, currentMap);
    }

    mapToCheckTransitions.forEach((item) => {
      this.checkMapTransitions(item.data, item.name);
    });

    console.log("📦 Maps and grids are loaded!");
  }

  private hasMapRequiredLayers(mapName: string, map: ITiled): void {
    const requiredLayers = MAP_REQUIRED_LAYERS;

    const mapLayers = map.layers.map((layer) => layer.name);

    for (const layer of requiredLayers) {
      if (!mapLayers.includes(layer)) {
        throw new InternalServerError(`❌ Map ${mapName} doesn't have required layer: ${layer}`);
      }
    }
  }

  private async checkMapUpdated(mapPath: string, mapFileName: string, mapObject: object): Promise<boolean> {
    const mapChecksum = this.checksum(mapPath);
    const fileName = mapFileName.replace(".json", "");
    const mapData = await MapModel.find({ name: fileName });

    if (mapData.length !== 0) {
      const map = mapData[0];
      if (map.checksum !== mapChecksum) {
        console.log(`📦 Map ${fileName} is updated!`);
        map.checksum = mapChecksum;
        await map.save();

        // create zip
        const pathToSave = `${STATIC_PATH}/maps`;
        await createZipMap(fileName, mapObject, pathToSave);
        return true;
      }
    } else {
      console.log(`📦 Map ${fileName} is created!`);
      await MapModel.create({ name: fileName, checksum: mapChecksum });

      // create zip
      const pathToSave = `${STATIC_PATH}/maps`;
      await createZipMap(fileName, mapObject, pathToSave);
      return true;
    }

    return false;
  }

  public checksum(path): string {
    return md5File.sync(path);
  }

  private checkMapTransitions(map: ITiled, mapName: string): void {
    const transitions = this.mapObjectsLoader.getObjectLayerData("Transitions", map);

    if (!transitions) {
      return;
    }

    transitions.forEach((transition) => {
      const properties = transition.properties;
      if (properties && properties.length > 0) {
        if (properties.length === 3) {
          const gridX = properties[0].value as unknown as number;
          const gridY = properties[1].value as unknown as number;
          const map = properties[2].value;

          const mapTiles = new MapTiles();
          const resultado = mapTiles.getTileId(map, gridX, gridY, MapLayers.Ground);
          if (resultado === 0) {
            throw new Error(`❌ MapLoader: Missing the map ${mapName}`);
          }
        } else {
          const map = properties[0].value;

          const mapData = MapLoader.maps.get(map);

          if (!mapData) {
            throw new Error(`❌ MapLoader: Missing the map ${map}`);
          }
        }
      }
    });
  }
}
