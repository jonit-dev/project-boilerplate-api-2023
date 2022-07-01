import { STATIC_PATH } from "@providers/constants/PathConstants";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { ITiled } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import md5File from "md5-file";
import { IMapMetaData } from "./MapMetadataTypes";

@provide(GetMapMetadataUseCase)
export class GetMapMetadataUseCase {
  public execute(mapName: string): object {
    try {
      const hash = md5File.sync(`${STATIC_PATH}/maps/${mapName}.json`);

      const map: ITiled = require(`${STATIC_PATH}/maps/${mapName}.json`);

      const layers = map.layers.map((layer) => layer.name);

      const tilesets = map.tilesets.map((tileset) => {
        return {
          name: tileset.name,
          imagePath: tileset.image,
        };
      });

      const mapMetadata: IMapMetaData = {
        hash,
        layers,
        tilesets,
        tileWidth: map.tilewidth,
        tileHeight: map.tileheight,
      };

      return mapMetadata;
    } catch (error: any | Error) {
      throw new BadRequestError(error.message);
    }
  }
}
