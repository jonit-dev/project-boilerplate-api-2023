import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { GeckosAuth } from "@providers/geckos/GeckosAuth";
import {
  GRID_HEIGHT,
  GRID_WIDTH,
  IConnectedPlayer,
  IPlayerPositionUpdateConfirm,
  PlayerGeckosEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { DataRetransmission } from "../geckos/DataRetransmission";
import { GeckosMessaging } from "../geckos/GeckosMessaging";

@provide(PlayerUpdate)
export class PlayerUpdate {
  constructor(
    private geckosMessagingHelper: GeckosMessaging,
    private dataRetransmission: DataRetransmission,
    private geckosAuth: GeckosAuth
  ) {}

  public onPlayerUpdatePosition(channel: ServerChannel): void {
    this.geckosAuth.authCharacterOn(
      channel,
      PlayerGeckosEvents.PlayerPositionUpdate,
      async (data: IConnectedPlayer, character: ICharacter) => {
        if (data) {
          const player = character;

          console.log(
            `📨 Received ${PlayerGeckosEvents.PlayerPositionUpdate}(${player?.name}): ${JSON.stringify(data)}`
          );

          // send message back to the user telling that the requested position update is not valid!

          const isPositionUpdateValid = this.checkIfValidPositionUpdate(data, character);

          this.geckosMessagingHelper.sendEventToUser<IPlayerPositionUpdateConfirm>(
            data.channelId,
            PlayerGeckosEvents.PlayerPositionUpdateConfirm,
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
            PlayerGeckosEvents.PlayerPositionUpdate,
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
      switch (data.direction) {
        case "up":
          updatedData.y = data.y - GRID_HEIGHT;
          break;
        case "down":
          updatedData.y = data.y + GRID_HEIGHT;
          break;
        case "left":
          updatedData.x = data.x - GRID_WIDTH;
          break;
        case "right":
          updatedData.x = data.x + GRID_WIDTH;
          break;
      }
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
