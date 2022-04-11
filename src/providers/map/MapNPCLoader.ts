import { ITiled } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MapLoader } from "./MapLoader";

@provide(MapNPCLoader)
export class MapNPCLoader {
  public loadNPCsData(mapName: string, currentMap: ITiled): void {
    // find npc layer from Tiled Map
    const npcsLayer = currentMap.layers.find((layer) => layer.name === "NPCs");

    if (!npcsLayer) {
      console.log('❌ Failed to load NPCs data, because there is no "NPCs" layer!');
      return;
    }

    // @ts-ignore
    const npcsData = npcsLayer.objects;

    MapLoader.npcs.set(mapName, npcsData);
  }
}
