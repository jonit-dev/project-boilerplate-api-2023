import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { TilemapParser } from "@providers/map/TilemapParser";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { NPCView } from "@providers/npc/NPCView";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  AnimationDirection,
  IConnectedPlayer,
  IPlayerPositionUpdateConfirm,
  PlayerSocketEvents,
  ScenesMetaData,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { SocketRetransmission } from "../sockets/SocketRetransmission";
@provide(PlayerUpdate)
export class PlayerUpdate {
  constructor(
    private socketMessaging: SocketMessaging,
    private dataRetransmission: SocketRetransmission,
    private socketAuth: SocketAuth,
    private movementHelper: MovementHelper,
    private npcView: NPCView
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

          // remove self, if present
          data.otherEntitiesInView = _.omit(data.otherEntitiesInView, [character._id]);
          character.otherEntitiesInView = data.otherEntitiesInView;
          await character.save();

          await this.dataRetransmission.bidirectionalDataRetransmission(
            character,
            data,
            PlayerSocketEvents.PlayerPositionUpdate,
            ["x", "y", "direction"],
            {
              isMoving: false,
            }
          );

          await this.npcView.warnUserAboutNPCsInView(character, data.otherEntitiesInView);

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
    const map = ScenesMetaData[character.scene].map;

    if (data.isMoving) {
      // if player is moving, update the position
      const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(
        data.x,
        data.y,
        data.direction! as AnimationDirection
      );

      // old position is now walkable
      TilemapParser.grids.get(map)!.setWalkableAt(ToGridX(data.x), ToGridY(data.y), true);

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

    // update our grid with solid information

    TilemapParser.grids.get(map)!.setWalkableAt(ToGridX(updatedData.x), ToGridY(updatedData.y), false);
  }
}
