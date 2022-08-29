import { ITiled, ITiledObject } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(MapObjectsLoader)
export class MapObjectsLoader {
  public getObjectLayerData(objectLayerName: string, map: ITiled): ITiledObject[] | undefined {
    const data = map.layers.find((layer) => layer.name === objectLayerName);

    if (!data) {
      return;
    }

    return data.objects;
  }
}
