import { ITiledObject, MapLoader } from "@providers/map/MapLoader";
import { INPC, NPCMovementType, ScenesMetaData } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { npcsBlueprintIndex } from "./data/index";

export interface INPCSeedData extends Omit<INPC, "_id"> {
  tiledId: number;
}

@provide(NPCLoader)
export class NPCLoader {
  public static NPCSeedData = new Map<string, INPCSeedData>();

  public loadNPCSeedData(): void {
    for (const [mapName, npcs] of MapLoader.tiledNPCs.entries()) {
      for (const tiledNPCData of npcs) {
        const { key, data } = this.mergeBaseNPCMetaDataWithTiledProps(tiledNPCData, mapName);

        NPCLoader.NPCSeedData.set(key, data);
      }
    }
  }

  private mergeBaseNPCMetaDataWithTiledProps(
    tiledNPCData: ITiledObject,
    mapName: string
  ): { key: string; data: INPCSeedData } {
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
    const blueprint = npcsBlueprintIndex[baseKey];
    const key = `${baseKey}-${tiledNPCData.id}`;

    tiledProperties.key = key;

    let sceneName;

    for (const [scene, data] of Object.entries(ScenesMetaData)) {
      if (data.map === mapName) {
        sceneName = scene;
        break;
      }
    }

    const additionalProperties = {
      x: tiledNPCData.x,
      y: tiledNPCData.y,
      tiledId: tiledNPCData.id,
      key,
      initialX: tiledNPCData.x,
      initialY: tiledNPCData.y,
      scene: sceneName,
    };

    const data = {
      ...blueprint,
      ...tiledProperties,
      ...additionalProperties,
    };

    return { key, data };
  }
}
