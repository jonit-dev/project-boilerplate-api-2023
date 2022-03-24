import { TilemapParser } from "@providers/map/TilemapParser";
import { INPC } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { npcsMetadataIndex } from "./npcs/index";

interface INPCMetaData extends Omit<INPC, "_id"> {}

@provide(NPCMetaDataLoader)
export class NPCMetaDataLoader {
  public static NPCMetaData = new Map<string, INPCMetaData>();

  public init(): void {
    for (const [, npcs] of TilemapParser.npcs.entries()) {
      for (const npc of npcs) {
        let customProperties: any = {};

        npc.properties.forEach((property) => {
          customProperties[property.name] = property.value;
        });

        const key = customProperties.key.replace("npc-", "");
        customProperties = _.omit(customProperties, "key");

        let baseMetaData = npcsMetadataIndex[key];

        const additionalProperties = {
          x: npc.x,
          y: npc.y,
        };

        baseMetaData = {
          ...baseMetaData,
          ...customProperties,
          ...additionalProperties,
        };

        console.log(baseMetaData);

        NPCMetaDataLoader.NPCMetaData.set(key, baseMetaData);
      }
    }
  }
}
