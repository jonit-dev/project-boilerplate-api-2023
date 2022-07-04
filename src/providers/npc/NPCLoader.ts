import { MapHelper } from "@providers/map/MapHelper";
import { MapLoader } from "@providers/map/MapLoader";
import { INPC } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { npcsBlueprintIndex } from "./data/index";

export interface INPCSeedData extends Omit<INPC, "_id"> {
  tiledId: number;
}

@provide(NPCLoader)
export class NPCLoader {
  constructor(private mapHelper: MapHelper) {}

  public loadNPCSeedData(): Map<string, INPCSeedData> {
    const npcSeedData = new Map<string, INPCSeedData>();

    for (const [mapName, npcs] of MapLoader.tiledNPCs.entries()) {
      for (const tiledNPCData of npcs) {
        if (!mapName) {
          throw new Error(`NPCLoader: Scene name is not found for map ${mapName}`);
        }

        const additionalProps: Record<string, any> = {
          initialX: tiledNPCData.x,
          initialY: tiledNPCData.y,
        };

        for (const prop of tiledNPCData.properties) {
          if (prop.name === "movementType" && prop.value === "FixedPath") {
            additionalProps.fixedPath = {
              endGridX: tiledNPCData.properties.find((p) => p.name === "endGridX")?.value,
              endGridY: tiledNPCData.properties.find((p) => p.name === "endGridY")?.value,
            };
          }
        }

        const { key, data } = this.mapHelper.mergeBlueprintWithTiledProps<INPCSeedData>(
          tiledNPCData,
          mapName,
          npcsBlueprintIndex,
          additionalProps
        );

        npcSeedData.set(key, data);
      }
    }

    return npcSeedData;
  }
}
