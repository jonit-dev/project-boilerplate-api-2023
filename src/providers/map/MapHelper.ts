import { ITiledObject, MapLayers } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(MapHelper)
export class MapHelper {
  public isCoordinateValid = (value: number | undefined | null): boolean => !(!value && value !== 0);

  public getHighestMapLayer = (): number => {
    const keys = Object.keys(MapLayers).filter((k) => typeof MapLayers[k as any] === "number");

    const values = keys.map((k) => Number(MapLayers[k as any]));

    return Math.max(...values);
  };

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
