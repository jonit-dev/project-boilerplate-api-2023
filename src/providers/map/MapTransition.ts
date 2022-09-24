import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterView } from "@providers/character/CharacterView";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  FromGridX,
  ITiledObject,
  IViewDestroyElementPayload,
  MapSocketEvents,
  ViewSocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MapLoader } from "./MapLoader";
import { MapObjectsLoader } from "./MapObjectsLoader";

type TransitionDestination = {
  map: string;
  gridX: number;
  gridY: number;
};

@provide(MapTransition)
export class MapTransition {
  constructor(
    private mapObjectsLoader: MapObjectsLoader,
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView
  ) {}

  public async changeCharacterScene(character: ICharacter, destination: TransitionDestination): Promise<void> {
    try {
      // fetch destination properties

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

      this.socketMessaging.sendMessageToCloseCharacters<IViewDestroyElementPayload>(
        character,
        ViewSocketEvents.Destroy,
        {
          type: "characters",
          id: character._id,
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  public async teleportCharacter(character: ICharacter, destination: TransitionDestination): Promise<void> {
    try {
      if (character.scene !== destination.map) {
        throw new Error(`Character Scene: "${character.scene}" and map to teleport: "${destination.map}" mismatch!`);
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

      // send event to client telling it that a character has been teleported?
      // @ts-ignore
      this.socketMessaging.sendEventToUser(character.channelId!, MapSocketEvents.TeleportCharacter);

      this.socketMessaging.sendMessageToCloseCharacters<IViewDestroyElementPayload>(
        character,
        ViewSocketEvents.Destroy,
        {
          type: "characters",
          id: character._id,
        }
      );
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

  public getTransitionProperty(transition: ITiledObject, propertyName: string): string | undefined {
    const property = transition.properties.find((property) => property.name === propertyName);

    if (property) {
      return property.value;
    }
  }
}
