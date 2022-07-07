import { provide } from "inversify-binding-decorators";
import { ITiledObject } from "./MapLoader";

@provide(MapHelper)
export class MapHelper {
  public mergeBlueprintWithTiledProps<T>(
    tiledData: ITiledObject,
    mapName: string,
    blueprintIndex: Record<string, any>,
    additionalProperties: Record<string, any> | null
  ): { key: string; data: T } {
    const tiledProperties: Record<string, any> = {};

    tiledData.properties.forEach((property) => {
      tiledProperties[property.name] = property.value;
    });

    const tiledKey = tiledProperties.key;

    const blueprint = blueprintIndex[tiledKey];
    const key = `${tiledKey}-${tiledData.id}`;

    if (!mapName) {
      throw new Error(`NPCLoader: Map name is for map ${mapName}`);
    }

    const data = {
      ...blueprint, // blueprint provides the "basic" properties for ths object
      ...tiledProperties,
      ...additionalProperties,
      key,
      tiledId: tiledData.id,
      x: tiledData.x,
      y: tiledData.y,
      scene: mapName,
    };

    return { key, data };
  }
}
