import { EXTERIOR_LIGHTENING_MAPS, NO_LIGHTENING_MAPS } from "@providers/constants/MapConstants";
import { STATIC_PATH } from "@providers/constants/PathConstants";
import { BadRequestError } from "@providers/errors/BadRequestError";

import { caveLightening, exteriorLightening } from "@providers/map/data/abstractions/mapLightening";
import { mapsBlueprintIndex } from "@providers/map/data/index";
import { MapTiles } from "@providers/map/MapTiles";
import { IMapMetaData, ITiled } from "@rpg-engine/shared";
import fs from "fs";
import { provide } from "inversify-binding-decorators";

@provide(GetMapMetadataUseCase)
export class GetMapMetadataUseCase {
  constructor(private mapTiles: MapTiles) {}

  public execute(mapName: string): object {
    try {
      const mapVersions = fs.readFileSync(`${STATIC_PATH}/config/map-versions.json`, "utf8");

      const version = JSON.parse(mapVersions)[mapName] as number;

      if (!version) {
        throw new BadRequestError(`Sorry, we could't find a map version map ${mapName}!`);
      }

      const map: ITiled = require(`${STATIC_PATH}/maps/${mapName}.json`);

      const layers = this.mapTiles.getMapLayers(mapName);

      const tilesets = map.tilesets.map((tileset) => {
        return {
          name: tileset.name,
        };
      });

      let baseMetadata;

      if (!NO_LIGHTENING_MAPS.includes(mapName)) {
        if (EXTERIOR_LIGHTENING_MAPS.includes(mapName)) {
          baseMetadata = exteriorLightening;
        } else {
          baseMetadata = caveLightening;
        }
      }

      // try to add additional blueprint metadata

      const additionalMetadata = mapsBlueprintIndex[mapName];

      const mapMetadata: Partial<IMapMetaData> = {
        key: mapName.toLowerCase(),
        ...baseMetadata,
        ...additionalMetadata,
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
