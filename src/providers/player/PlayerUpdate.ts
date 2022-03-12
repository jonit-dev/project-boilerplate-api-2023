import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  AnimationDirection,
  IConnectedPlayer,
  IPlayerPositionUpdateConfirm,
  PlayerSocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { SocketRetransmission } from "../sockets/SocketRetransmission";

@provide(PlayerUpdate)
export class PlayerUpdate {
  constructor(
    private socketMessaging: SocketMessaging,
    private dataRetransmission: SocketRetransmission,
    private socketAuth: SocketAuth,
    private movementHelper: MovementHelper
  ) {}

  public onPlayerUpdatePosition(channel: ServerChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      PlayerSocketEvents.PlayerPositionUpdate,
      async (data: IConnectedPlayer, character: ICharacter) => {
        if (data) {
          const player = character;

          console.log(
            `📨 Received ${PlayerSocketEvents.PlayerPositionUpdate}(${player?.name}): ${JSON.stringify(data)}`
          );

          // send message back to the user telling that the requested position update is not valid!

          const isPositionUpdateValid = this.checkIfValidPositionUpdate(data, character);

          this.socketMessaging.sendEventToUser<IPlayerPositionUpdateConfirm>(
            data.channelId,
            PlayerSocketEvents.PlayerPositionUpdateConfirm,
            {
              id: data.id,
              isValid: isPositionUpdateValid,
              direction: data.direction!,
            }
          );

          if (!isPositionUpdateValid) {
            return;
          }

          await this.dataRetransmission.bidirectionalDataRetransmission(
            character,
            data,
            PlayerSocketEvents.PlayerPositionUpdate,
            ["x", "y", "direction"],
            {
              isMoving: false,
            }
          );

          // update emitter position from connectedPlayers
          await this.updateServerSideEmitterInfo(data, character);
        }
      }
    );
  }

  private checkIfValidPositionUpdate(data: IConnectedPlayer, character: ICharacter): boolean {
    //! always return false for now
    console.log("checking if requested position update is valid...");

    if (Math.round(character.x) === Math.round(data.x) && Math.round(character.y) === Math.round(data.y)) {
      return true; // initial movement origin is the same as our server representation. It means it's valid!
    }

    return false;
  }

  private async updateServerSideEmitterInfo(data: IConnectedPlayer, character: ICharacter): Promise<void> {
    const updatedData = data;

    if (data.isMoving) {
      // if player is moving, update the position
      const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(
        data.x,
        data.y,
        data.direction! as AnimationDirection
      );

      updatedData.x = newX;
      updatedData.y = newY;
    }

    await Character.updateOne(
      { _id: character._id },
      {
        $set: {
          x: updatedData.x,
          y: updatedData.y,
          direction: data.direction,
          cameraCoordinates: data.cameraCoordinates,
        },
      }
    );
  }
}
