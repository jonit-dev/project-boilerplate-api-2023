import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { BattleNetworkStopTargeting } from "@providers/battle/network/BattleNetworkStopTargetting";
import { CharacterView } from "@providers/character/CharacterView";
import { Locker } from "@providers/locks/Locker";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  BattleSocketEvents,
  FromGridX,
  IBattleCancelTargeting,
  IMapTransitionChangeMapPayload,
  IViewDestroyElementPayload,
  MapLayers,
  MapSocketEvents,
  ViewSocketEvents,
} from "@rpg-engine/shared";
import { EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import { GridManager } from "../GridManager";
import { MapSolids } from "../MapSolids";

type TransitionDestination = {
  map: string;
  gridX: number;
  gridY: number;
};

@provide(MapTransitionTeleport)
export class MapTransitionTeleport {
  constructor(
    private socketMessaging: SocketMessaging,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting,
    private characterView: CharacterView,
    private locker: Locker,
    private mapSolids: MapSolids,
    private gridManager: GridManager
  ) {}

  @TrackNewRelicTransaction()
  public async changeCharacterScene(character: ICharacter, destination: TransitionDestination): Promise<void> {
    try {
      const canProceed = await this.locker.lock(`character-changing-scene-${character._id}`);

      if (!canProceed) {
        return;
      }

      const isWalkable = await this.gridManager.isWalkable(destination.map, destination.gridX, destination.gridY);

      if (!isWalkable) {
        return;
      }

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

      await this.clearCharacterBattleTarget(character);

      await this.characterView.clearCharacterView(character);
      /* 
      Send event to client telling it to restart the map. 
      We don't need to specify which, because it will trigger a character 
      refresh and scene reload on the client side. 
      */

      this.socketMessaging.sendEventToUser<IMapTransitionChangeMapPayload>(
        character.channelId!,
        MapSocketEvents.ChangeMap,
        {
          map: destination.map,
          x: FromGridX(destination.gridX),
          y: FromGridX(destination.gridY),
        }
      );

      await this.socketMessaging.sendEventToCharactersAroundCharacter<IViewDestroyElementPayload>(
        character,
        ViewSocketEvents.Destroy,
        {
          type: "characters",
          id: character._id,
        }
      );
    } catch (error) {
      console.error(error);
      await this.locker.unlock(`character-changing-scene-${character._id}`);
    } finally {
      await this.locker.unlock(`character-changing-scene-${character._id}`);
    }
  }

  @TrackNewRelicTransaction()
  public async sameMapTeleport(character: ICharacter, destination: TransitionDestination): Promise<void> {
    try {
      const canProceed = await this.locker.lock(`character-changing-scene-${character._id}`);

      if (!canProceed) {
        return;
      }

      const isSolid = this.mapSolids.isTileSolid(
        destination.map,
        destination.gridX,
        destination.gridY,
        MapLayers.Character
      );

      if (isSolid) {
        return;
      }

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

      await this.clearCharacterBattleTarget(character);

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
    } catch (error) {
      console.error(error);
      await this.locker.unlock(`character-changing-scene-${character._id}`);
    } finally {
      await this.locker.unlock(`character-changing-scene-${character._id}`);
    }
  }

  private async clearCharacterBattleTarget(character: ICharacter): Promise<void> {
    if (character.target?.id && character.target?.type) {
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
  }
}
