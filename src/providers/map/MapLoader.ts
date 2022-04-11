import { STATIC_PATH } from "@providers/constants/PathConstants";
import { ITiled } from "@rpg-engine/shared";
import fs from "fs";
import { provide } from "inversify-binding-decorators";
import PF from "pathfinding";
import { MapNPCLoader } from "./MapNPCLoader";
import { MapSolids } from "./MapSolids";

export interface ITiledNPCProperty {
  name: string;
  value: string;
}

export interface ITiledNPC {
  id: string;
  x: number;
  y: number;
  properties: ITiledNPCProperty[];
}

@provide(MapLoader)
export class MapLoader {
  public static maps: Map<string, ITiled> = new Map();
  public static grids: Map<string, PF.Grid> = new Map();
  public static npcs: Map<string, ITiledNPC[]> = new Map();
  constructor(private mapSolidsManager: MapSolids, private mapNPCLoader: MapNPCLoader) {}

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

      this.mapNPCLoader.loadNPCsData(mapName, currentMap);
    }

    console.log("📦 Maps and grids are loaded!");
  }
}
