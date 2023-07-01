import { BlueprintNamespaces } from "@providers/blueprint/BlueprintManager";
import { blueprintManager } from "@providers/inversify/container";
import { ITiledObject, MapLayers } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(MapHelper)
export class MapHelper {
  constructor() {}

  public isCoordinateValid = (value: number | undefined | null): boolean => !(!value && value !== 0);

  public areAllCoordinatesValid(...args: number[][]): boolean {
    return args.every((arg) => this.isCoordinateValid(arg[0]) && this.isCoordinateValid(arg[1]));
  }

  public getHighestMapLayer = (): number => {
    let highest = 0;
    for (const key in MapLayers) {
      const value = MapLayers[key as keyof typeof MapLayers];
      if (typeof value === "number" && value > highest) {
        highest = value;
      }
    }
    return highest;
  };

  public async mergeBlueprintWithTiledProps<T>(
    tiledData: ITiledObject,
    mapName: string,
    additionalProperties: Record<string, any> | null,
    blueprintNamespace: BlueprintNamespaces
  ): Promise<{ key: string; data: T }> {
    const tiledProperties: Record<string, any> = {};

    tiledData.properties.forEach((property) => {
      tiledProperties[property.name] = property.value;
    });

    const tiledKey = tiledProperties.key;

    // const blueprint = blueprintIndex[tiledKey];
    const blueprint = await blueprintManager.getBlueprint<T>(blueprintNamespace, tiledKey);
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

    return { key, data: data as T };
  }
}
