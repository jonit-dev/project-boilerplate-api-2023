import { STATIC_PATH } from "@providers/constants/PathConstants";
import { ITiled } from "@rpg-engine/shared";
import fs from "fs";
import { provide } from "inversify-binding-decorators";
import PF from "pathfinding";
import { MapObjectsLoader } from "./MapObjectsLoader";
import { MapSolids } from "./MapSolids";

export interface ITiledObjectProps {
  [str: string]: any;
  name: string;
  value: string;
}

export interface ITiledObject {
  id: string;
  x: number;
  y: number;
  properties: ITiledObjectProps[];
}

@provide(MapLoader)
export class MapLoader {
  public static maps: Map<string, ITiled> = new Map();
  public static grids: Map<string, PF.Grid> = new Map();
  public static tiledNPCs: Map<string, ITiledObject[]> = new Map();
  public static tiledItems: Map<string, ITiledObject[]> = new Map();
  constructor(private mapSolidsManager: MapSolids, private mapNPCLoader: MapObjectsLoader) {}

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

      MapLoader.maps.set(mapName, currentMap);
      MapLoader.grids.set(mapName, new PF.Grid(currentMap.width, currentMap.height));

      this.mapSolidsManager.generateGridSolids(mapName, currentMap);

      this.mapNPCLoader.loadNPCsTiledData(mapName, currentMap);
      this.mapNPCLoader.loadItemsTiledData(mapName, currentMap);
    }

    console.log("📦 Maps and grids are loaded!");
  }
}
