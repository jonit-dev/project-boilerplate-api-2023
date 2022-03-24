import { TilemapParser } from "@providers/map/TilemapParser";
import { INPC, NPCMovementType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { npcsMetadataIndex } from "./npcs/index";

interface INPCMetaData extends Omit<INPC, "_id"> {
  tiledId: number;
}

@provide(NPCMetaDataLoader)
export class NPCMetaDataLoader {
  public static NPCMetaData = new Map<string, INPCMetaData>();

  public loadNPCMetaData(): void {
    for (const [, npcs] of TilemapParser.npcs.entries()) {
      for (const npc of npcs) {
        let tiledProperties: any = {};

        npc.properties.forEach((property) => {
          tiledProperties[property.name] = property.value;
        });

        if (tiledProperties.movementType === NPCMovementType.FixedPath) {
          const { endGridX, endGridY } = tiledProperties;

          tiledProperties = {
            ...tiledProperties,
            fixedPath: {
              endGridX: Number(endGridX),
              endGridY: Number(endGridY),
            },
          };
        }

        const baseKey = `${tiledProperties.key.replace("npc-", "")}`;
        tiledProperties = _.omit(tiledProperties, "key");

        let baseMetaData = npcsMetadataIndex[baseKey];

        const key = `${baseKey}-${npc.id}`;

        const additionalProperties = {
          x: npc.x,
          y: npc.y,
          tiledId: npc.id,
          key,
        };

        baseMetaData = {
          ...baseMetaData,
          ...tiledProperties,
          ...additionalProperties,
        };

        NPCMetaDataLoader.NPCMetaData.set(key, baseMetaData);
      }
    }
  }
}
