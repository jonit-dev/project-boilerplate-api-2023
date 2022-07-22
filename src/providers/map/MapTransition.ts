import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { FromGridX, ITiledObject, MapSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MapLoader } from "./MapLoader";
import { MapObjectsLoader } from "./MapObjectsLoader";

@provide(MapTransition)
export class MapTransition {
  constructor(private mapObjectsLoader: MapObjectsLoader, private socketMessaging: SocketMessaging) {}

  public async changeCharacterScene(character: ICharacter, transition: ITiledObject): Promise<void> {
    try {
      // fetch destination properties
      const destination = {
        map: this.getTransitionProperty(transition, "map"),
        gridX: Number(this.getTransitionProperty(transition, "gridX")),
        gridY: Number(this.getTransitionProperty(transition, "gridY")),
      };

      if (!destination.map || !destination.gridX || !destination.gridY) {
        throw new Error("Failed to fetch required destination properties.");
      }

      // change character map
      await Character.updateOne(
        { _id: character._id },
        {
          $set: {
            scene: destination.map,
            x: FromGridX(destination.gridX),
            y: FromGridX(destination.gridY),
          },
        }
      );

      // send event to client telling it to restart the map. We don't need to specify which, because it will trigger a character refresh and scene reload on the client side.
      this.socketMessaging.sendEventToUser(character.channelId!, MapSocketEvents.ChangeMap);
    } catch (error) {
      console.error(error);
    }
  }

  public getTransitionAtXY(mapName: string, x: number, y: number): ITiledObject | undefined {
    try {
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
    } catch (error) {
      console.error(error);
    }
  }

  private getTransitionProperty(transition: ITiledObject, propertyName: string): string | undefined {
    const property = transition.properties.find((property) => property.name === propertyName);

    if (property) {
      return property.value;
    }
  }
}
