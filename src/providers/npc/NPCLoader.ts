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
  public static NPCSeedData = new Map<string, INPCSeedData>();

  constructor(private mapHelper: MapHelper) {}

  public loadNPCSeedData(): void {
    for (const [mapName, npcs] of MapLoader.tiledNPCs.entries()) {
      for (const tiledNPCData of npcs) {
        const sceneName = this.mapHelper.getSceneNameFromMapName(mapName);

        if (!sceneName) {
          throw new Error(`NPCLoader: Scene name is not found for map ${mapName}`);
        }

        const additionalProps: Record<string, any> = {
          x: tiledNPCData.x,
          y: tiledNPCData.y,
          tiledId: tiledNPCData.id,
          initialX: tiledNPCData.x,
          initialY: tiledNPCData.y,
          scene: sceneName,
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
          additionalProps,
          "npc"
        );

        NPCLoader.NPCSeedData.set(key, data);
      }
    }
  }
}
