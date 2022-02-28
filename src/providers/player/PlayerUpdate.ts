import { Character } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { Data, ServerChannel } from "@geckos.io/server";
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
import { GeckosServerHelper } from "../geckos/GeckosServerHelper";

@provide(PlayerUpdate)
export class PlayerUpdate {
  constructor(
    private geckosMessagingHelper: GeckosMessaging,
    private dataRetransmission: DataRetransmission,
    private geckosAuth: GeckosAuth
  ) {}

  public onPlayerUpdatePosition(channel: ServerChannel): void {
    this.geckosAuth.authCharacterOn(channel, PlayerGeckosEvents.PlayerPositionUpdate, (d: Data) => {
      const data = d as IConnectedPlayer;
      const character = data.character;

      if (data) {
        const player = character;

        console.log(`📨 Received ${PlayerGeckosEvents.PlayerPositionUpdate}(${player?.name}): ${JSON.stringify(data)}`);

        // send message back to the user telling that the requested position update is not valid!

        const isPositionUpdateValid = this.checkIfValidPositionUpdate(data);

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

        this.dataRetransmission.bidirectionalDataRetransmission(
          data,
          PlayerGeckosEvents.PlayerPositionUpdate,
          ["x", "y", "direction"],
          {
            isMoving: false,
          }
        );

        // update emitter position from connectedPlayers
        this.updateServerSideEmitterInfo(data);

        console.log(
          `🆕 Updated ${character.name} data: x: ${character.x}, y: ${character.y} direction: ${character.direction}`
        );
      }
    });
  }

  private checkIfValidPositionUpdate(data: IConnectedPlayer): boolean {
    //! always return false for now
    console.log("checking if requested position update is valid...");

    const player = data.character;

    if (Math.round(player.x) === Math.round(data.x) && Math.round(player.y) === Math.round(data.y)) {
      return true; // initial movement origin is the same as our server representation. It means it's valid!
    }

    return false;
  }

  private async updateServerSideEmitterInfo(data: IConnectedPlayer): Promise<void> {
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

    await Character.updateOne({ _id: data.character._id }, { $set: { x: updatedData.x, y: updatedData.y } });

    GeckosServerHelper.connectedPlayers[data.id] = {
      ...updatedData,
      lastActivity: Date.now(),
    };
  }
}
