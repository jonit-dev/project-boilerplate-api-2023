import { ITiled, ITiledObject } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(MapObjectsLoader)
export class MapObjectsLoader {
  public getObjectLayerData(objectLayerName: string, map: ITiled): ITiledObject[] | undefined {
    const data = map.layers.find((layer) => layer.name === objectLayerName);

    if (!data) {
      console.log(`❌ Failed to load data because there is no "${objectLayerName}" layer!`);
      return;
    }

    return data.objects;
  }
}
