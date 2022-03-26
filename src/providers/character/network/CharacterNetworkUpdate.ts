import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { TilemapParser } from "@providers/map/TilemapParser";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { NPCView } from "@providers/npc/NPCView";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketRetransmission } from "@providers/sockets/SocketRetransmission";
import {
  AnimationDirection,
  CharacterSocketEvents,
  ICharacterPositionUpdateConfirm,
  ICharacterPositionUpdatePayload,
  MapLayers,
  ScenesMetaData,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
@provide(CharacterNetworkUpdate)
export class CharacterNetworkUpdate {
  constructor(
    private socketMessaging: SocketMessaging,
    private dataRetransmission: SocketRetransmission,
    private socketAuth: SocketAuth,
    private movementHelper: MovementHelper,
    private npcView: NPCView
  ) {}

  public onCharacterUpdatePosition(channel: ServerChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterPositionUpdate,
      async (data: ICharacterPositionUpdatePayload, character: ICharacter) => {
        if (data) {
          console.log(
            `📨 Received ${CharacterSocketEvents.CharacterPositionUpdate}(${character?.name}): ${JSON.stringify(data)}`
          );

          // send message back to the user telling that the requested position update is not valid!

          const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(
            data.x,
            data.y,
            data.direction! as AnimationDirection
          );

          const isPositionUpdateValid = await this.checkIfValidPositionUpdate(data, character, newX, newY);

          this.socketMessaging.sendEventToUser<ICharacterPositionUpdateConfirm>(
            data.channelId,
            CharacterSocketEvents.CharacterPositionUpdateConfirm,
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
            CharacterSocketEvents.CharacterPositionUpdate,
            ["x", "y", "direction"],
            {
              isMoving: false,
            }
          );

          await this.npcView.warnUserAboutNPCsInView(character, data.otherEntitiesInView);

          // update emitter position from connectedPlayers
          await this.updateServerSideEmitterInfo(data, character, newX, newY);
        }
      }
    );
  }

  private async checkIfValidPositionUpdate(
    data: ICharacterPositionUpdatePayload,
    character: ICharacter,
    newX: number,
    newY: number
  ): Promise<boolean> {
    const isSolid = await this.movementHelper.isSolid(
      ScenesMetaData[character.scene].map,
      ToGridX(newX),
      ToGridY(newY),
      MapLayers.Character
    );

    if (isSolid) {
      return false;
    }

    if (Math.round(character.x) === Math.round(data.x) && Math.round(character.y) === Math.round(data.y)) {
      return true; // initial movement origin is the same as our server representation. It means it's valid!
    }

    return false;
  }

  private async updateServerSideEmitterInfo(
    data: ICharacterPositionUpdatePayload,
    character: ICharacter,
    newX: number,
    newY: number
  ): Promise<void> {
    const updatedData = data;
    const map = ScenesMetaData[character.scene].map;

    if (data.isMoving) {
      // if character is moving, update the position

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
