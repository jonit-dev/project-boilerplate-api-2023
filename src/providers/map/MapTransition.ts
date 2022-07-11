import { ITiledObject } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MapLoader } from "./MapLoader";
import { MapObjectsLoader } from "./MapObjectsLoader";

@provide(MapTransition)
export class MapTransition {
  constructor(private mapObjectsLoader: MapObjectsLoader) {}

  public getTransitionAtXY(mapName: string, x: number, y: number): ITiledObject | undefined {
    const map = MapLoader.maps.get(mapName);

    if (!map) {
      throw new Error(`MapTransition: Map "${mapName}" is not found!`);
    }

    const transitions = this.mapObjectsLoader.getObjectLayerData("Transitions", map);

    if (!transitions) {
      return;
    }

    const sameXTransitions = transitions.filter((transition) => transition.x === x);

    if (sameXTransitions) {
      const transition = sameXTransitions.find((transition) => {
        return transition.y === y;
      });
      return transition;
    }
  }
}
