import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { BattleNetworkStopTargeting } from "@providers/battle/network/BattleNetworkStopTargetting";
import { CharacterView } from "@providers/character/CharacterView";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import {
  BattleSocketEvents,
  FromGridX,
  IBattleCancelTargeting,
  ITiledObject,
  IViewDestroyElementPayload,
  MapSocketEvents,
  ViewSocketEvents,
} from "@rpg-engine/shared";
import { EntityType } from "@rpg-engine/shared/dist/types/entity.types";
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
    private battleNetworkStopTargeting: BattleNetworkStopTargeting,
    private characterView: CharacterView,
    private newRelic: NewRelic
  ) {}

  public async changeCharacterScene(character: ICharacter, destination: TransitionDestination): Promise<void> {
    await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "MapTransition.changeCharacterScene",
      async () => {
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

        if (character.target.id && character.target.type) {
          const targetId = character.target.id as unknown as string;
          const targetType = character.target.type as unknown as EntityType;
          const targetReason = "Your battle target was lost.";

          const dataOfCancelTargeting: IBattleCancelTargeting = {
            targetId: targetId,
            type: targetType,
            reason: targetReason,
          };

          this.socketMessaging.sendEventToUser<IBattleCancelTargeting>(
            character.channelId!,
            BattleSocketEvents.CancelTargeting,
            dataOfCancelTargeting
          );

          await this.battleNetworkStopTargeting.stopTargeting(character);
        }

        await this.characterView.clearCharacterView(character);
        /* 
      Send event to client telling it to restart the map. 
      We don't need to specify which, because it will trigger a character 
      refresh and scene reload on the client side. 
      */

        this.socketMessaging.sendEventToUser(character.channelId!, MapSocketEvents.ChangeMap);

        await this.socketMessaging.sendEventToCharactersAroundCharacter<IViewDestroyElementPayload>(
          character,
          ViewSocketEvents.Destroy,
          {
            type: "characters",
            id: character._id,
          }
        );
      }
    );
  }

  public async sameMapTeleport(character: ICharacter, destination: TransitionDestination): Promise<void> {
    await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "MapTransition.sameMapTeleport",
      async () => {
        if (character.scene !== destination.map) {
          throw new Error(
            `Character Scene: "${character.scene}" and map to teleport: "${destination.map}" should be the same!`
          );
        }

        // change character map
        await Character.updateOne(
          { _id: character._id },
          {
            $set: {
              x: FromGridX(destination.gridX),
              y: FromGridX(destination.gridY),
              scene: destination.map,
            },
          }
        );

        if (character.target.id && character.target.type) {
          const targetId = character.target.id as unknown as string;
          const targetType = character.target.type as unknown as EntityType;
          const targetReason = "Your battle target was lost.";

          const dataOfCancelTargeting: IBattleCancelTargeting = {
            targetId: targetId,
            type: targetType,
            reason: targetReason,
          };

          this.socketMessaging.sendEventToUser<IBattleCancelTargeting>(
            character.channelId!,
            BattleSocketEvents.CancelTargeting,
            dataOfCancelTargeting
          );

          await this.battleNetworkStopTargeting.stopTargeting(character);
        }

        await this.characterView.clearCharacterView(character);

        // send event to client telling it that a character has been teleported?

        this.socketMessaging.sendEventToUser(character.channelId!, MapSocketEvents.SameMapTeleport, destination);

        await this.socketMessaging.sendEventToCharactersAroundCharacter<IViewDestroyElementPayload>(
          character,
          ViewSocketEvents.Destroy,
          {
            type: "characters",
            id: character._id,
          }
        );
      }
    );
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
