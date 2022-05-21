import { ITiled } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MapLoader } from "./MapLoader";

@provide(MapObjectsLoader)
export class MapObjectsLoader {
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
    console.log("📦 NPCs metadata was loaded from Tiled!");
  }

  public loadItemsData(mapName: string, currentMap: ITiled): void {
    // find npc layer from Tiled Map
    const itemsLayer = currentMap.layers.find((layer) => layer.name === "Items");

    if (!itemsLayer) {
      console.log('❌ Failed to load Items data, because there is no "Items" layer!');
      return;
    }

    // @ts-ignore
    const itemsData = itemsLayer.objects;

    MapLoader.items.set(mapName, itemsData);
    console.log("📦 Items metadata was loaded from Tiled!");
  }
}
