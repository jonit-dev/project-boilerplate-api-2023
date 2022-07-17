import { STATIC_PATH } from "@providers/constants/PathConstants";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { IMapMetaData, ITiled, MAP_LAYERS } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import md5File from "md5-file";

@provide(GetMapMetadataUseCase)
export class GetMapMetadataUseCase {
  public execute(mapName: string): object {
    try {
      const hash = md5File.sync(`${STATIC_PATH}/maps/${mapName}.json`);

      const map: ITiled = require(`${STATIC_PATH}/maps/${mapName}.json`);

      const layers = MAP_LAYERS;

      const tilesets = map.tilesets.map((tileset) => {
        return {
          name: tileset.name,
        };
      });

      const mapMetadata: IMapMetaData = {
        name: mapName,
        hash,
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
