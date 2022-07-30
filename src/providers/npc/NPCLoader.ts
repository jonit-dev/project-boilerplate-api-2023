import { MapHelper } from "@providers/map/MapHelper";
import { MapLoader } from "@providers/map/MapLoader";
import { MapObjectsLoader } from "@providers/map/MapObjectsLoader";
import { INPC } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { npcsBlueprintIndex } from "./data/index";

export interface INPCSeedData extends Omit<INPC, "_id"> {
  tiledId: number;
}

@provide(NPCLoader)
export class NPCLoader {
  constructor(private mapHelper: MapHelper, private mapObjectsLoader: MapObjectsLoader) {}

  public loadNPCSeedData(): Map<string, INPCSeedData> {
    const npcSeedData = new Map<string, INPCSeedData>();

    for (const [mapName, mapData] of MapLoader.maps.entries()) {
      const NPCs = this.mapObjectsLoader.getObjectLayerData("NPCs", mapData);

      if (!NPCs) {
        continue;
      }

      const npcKeys = getNpcKeys(NPCs);
      const uniqueArrayKeys = Array.from(new Set(npcKeys));
      checkIfNpcBlueprintsExists(uniqueArrayKeys, mapName);

      for (const tiledNPC of NPCs) {
        if (!mapName) {
          throw new Error(`NPCLoader: Scene name is not found for map ${mapName}`);
        }

        const additionalProps: Record<string, any> = {
          initialX: tiledNPC.x,
          initialY: tiledNPC.y,
        };

        for (const prop of tiledNPC.properties) {
          if (prop.name === "movementType" && prop.value === "FixedPath") {
            additionalProps.fixedPath = {
              endGridX: tiledNPC.properties.find((p) => p.name === "endGridX")?.value,
              endGridY: tiledNPC.properties.find((p) => p.name === "endGridY")?.value,
            };
          }
        }

        const { key, data } = this.mapHelper.mergeBlueprintWithTiledProps<INPCSeedData>(
          tiledNPC,
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

function getNpcKeys(NPCs: any[]): string[] {
  return NPCs.map((npc) => {
    const name = npc.name;
    const key = name.toLowerCase().replace(" ", "-");
    return key;
  });
}

function checkIfNpcBlueprintsExists(NPCs: string[], mapName: string): void {
  const missingNPCs = NPCs.filter((npc) => !npcsBlueprintIndex[npc]);
  if (missingNPCs.length > 0) {
    throw new Error(
      `❌ NPCLoader: Missing NPC blueprints for keys ${missingNPCs.join(", ")}. Please, double check the map ${mapName}`
    );
  }
}
