import { EXTERIOR_LIGHTNING_MAPS, NO_LIGHTNING_MAPS } from "@providers/constants/MapConstants";
import { STATIC_PATH } from "@providers/constants/PathConstants";
import { BadRequestError } from "@providers/errors/BadRequestError";

import { caveLightening, exteriorLightening } from "@providers/map/data/abstractions/mapLightening";
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

      let mapBlueprint;

      if (!NO_LIGHTNING_MAPS.includes(mapName)) {
        if (EXTERIOR_LIGHTNING_MAPS.includes(mapName)) {
          mapBlueprint = exteriorLightening;
        } else {
          mapBlueprint = caveLightening;
        }
      }

      const mapMetadata: Partial<IMapMetaData> = {
        key: mapName.toLowerCase(),
        ...mapBlueprint,
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
