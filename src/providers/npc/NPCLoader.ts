import { ITiledNPC, MapLoader } from "@providers/map/MapLoader";
import { INPC, NPCMovementType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { npcsMetadataIndex } from "./data/index";

export interface INPCMetaData extends Omit<INPC, "_id"> {
  tiledId: number;
}

@provide(NPCLoader)
export class NPCLoader {
  public static NPCMetaData = new Map<string, INPCMetaData>();

  public loadNPCMetaData(): void {
    for (const [, npcs] of MapLoader.npcs.entries()) {
      for (const tiledNPCData of npcs) {
        const { key, baseNPCMetaData } = this.loadTiledNPCMetadata(tiledNPCData);

        NPCLoader.NPCMetaData.set(key, baseNPCMetaData);
      }
    }
  }

  private loadTiledNPCMetadata(tiledNPCData: ITiledNPC): { key: string; baseNPCMetaData: INPCMetaData } {
    let tiledProperties: Record<string, any> = {};

    tiledNPCData.properties.forEach((property) => {
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
    const baseMetaData = npcsMetadataIndex[baseKey];
    const key = `${baseKey}-${tiledNPCData.id}`;

    tiledProperties.key = key;

    const additionalProperties = {
      x: tiledNPCData.x,
      y: tiledNPCData.y,
      tiledId: tiledNPCData.id,
      key,
      initialX: tiledNPCData.x,
      initialY: tiledNPCData.y,
    };

    const baseNPCMetaData = {
      ...baseMetaData,
      ...tiledProperties,
      ...additionalProperties,
    };

    return { key, baseNPCMetaData };
  }
}
