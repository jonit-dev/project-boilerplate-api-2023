import { STATIC_PATH } from "@providers/constants/PathConstants";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { IMapMetaData, ITiled, MAP_LAYERS } from "@rpg-engine/shared";
import fs from "fs";
import { provide } from "inversify-binding-decorators";

@provide(GetMapMetadataUseCase)
export class GetMapMetadataUseCase {
  public execute(mapName: string): object {
    try {
      const mapVersions = fs.readFileSync(`${STATIC_PATH}/config/map-versions.json`, "utf8");

      const version = JSON.parse(mapVersions)[mapName] as number;

      if (!version) {
        throw new BadRequestError(`Sorry, we could't find a map version map ${mapName}!`);
      }

      const map: ITiled = require(`${STATIC_PATH}/maps/${mapName}.json`);

      const layers = MAP_LAYERS;

      const tilesets = map.tilesets.map((tileset) => {
        return {
          name: tileset.name,
        };
      });

      const mapMetadata: IMapMetaData = {
        name: mapName,
        version,
        layers,
        tilesets,
        tileWidth: map.tilewidth,
        tileHeight: map.tileheight,
        width: map.width,
        height: map.height,
      };

      return mapMetadata;
    } catch (error: any | Error) {
      throw new BadRequestError(error.message);
    }
  }
}
