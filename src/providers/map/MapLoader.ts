import { MapModel } from "@entities/ModuleSystem/MapModel";
import { STATIC_PATH } from "@providers/constants/PathConstants";
import { ITiled } from "@rpg-engine/shared";
import { compress, decompress } from "compress-json";
import fs from "fs";
import { provide } from "inversify-binding-decorators";
import JSZip from "jszip";
import md5File from "md5-file";
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

      this.checkMapUpdated(mapPath, mapFileName, currentMap);

      const mapName = mapFileName.replace(".json", "");

      MapLoader.maps.set(mapName, currentMap);
      MapLoader.grids.set(mapName, new PF.Grid(currentMap.width, currentMap.height));

      this.mapSolidsManager.generateGridSolids(mapName, currentMap);

      this.mapNPCLoader.loadNPCsTiledData(mapName, currentMap);
      this.mapNPCLoader.loadItemsTiledData(mapName, currentMap);
    }

    console.log("📦 Maps and grids are loaded!");
  }

  private async checkMapUpdated(mapPath: string, mapFileName: string, mapObject: object): Promise<void> {
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
        await createZip(fileName, mapObject);
      }
    } else {
      console.log(`📦 Map ${fileName} is created!`);
      await MapModel.create({ name: fileName, checksum: mapChecksum });

      // create zip
      await createZip(fileName, mapObject);
    }

    await readZip(fileName);
  }

  public checksum(path): string {
    return md5File.sync(path);
  }
}

async function createZip(fileName: string, mapObject: object): Promise<void> {
  const data = compress(mapObject);
  const zip = new JSZip();
  zip.file(`${fileName}.txt`, JSON.stringify(data));
  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  await fs.createWriteStream(`${STATIC_PATH}/maps/${fileName}.zip`).write(buffer);
}

async function readZip(fileName): Promise<void> {
  const data = await fs.readFileSync(`${STATIC_PATH}/maps/${fileName}.zip`);

  const zipRead = new JSZip();

  // eslint-disable-next-line promise/no-promise-in-callback
  const content = await zipRead.loadAsync(data);
  const fileBuffer = await content.file(`${fileName}.txt`)!.async("uint8array");
  const bufferedString = Buffer.from(fileBuffer.buffer).toString();
  const fileContent = decompress(JSON.parse(bufferedString));

  console.log(fileContent);
}
