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
  CharacterSocketEvents,
  ICharacterPositionUpdateConfirm,
  ICharacterPositionUpdateFromClient,
  ICharacterPositionUpdateFromServer,
  MapLayers,
  ScenesMetaData,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { CharacterView } from "../CharacterView";
@provide(CharacterNetworkUpdate)
export class CharacterNetworkUpdate {
  constructor(
    private socketMessaging: SocketMessaging,
    private socketAuth: SocketAuth,
    private movementHelper: MovementHelper,
    private npcView: NPCView,
    private characterView: CharacterView
  ) {}

  public onCharacterUpdatePosition(channel: ServerChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterPositionUpdate,
      async (data: ICharacterPositionUpdateFromClient, character: ICharacter) => {
        if (data) {
          console.log(
            `📨 Received ${CharacterSocketEvents.CharacterPositionUpdate}(${character?.name}): ${JSON.stringify(data)}`
          );

          const direction = this.movementHelper.getGridMovementDirection(
            ToGridX(data.x),
            ToGridY(data.y),
            ToGridX(data.newX),
            ToGridY(data.newY)
          );

          const isMoving = direction !== undefined;

          // send message back to the user telling that the requested position update is not valid!

          let isPositionUpdateValid = true;

          const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(
            data.x,
            data.y,
            direction as AnimationDirection
          );

          if (isMoving) {
            isPositionUpdateValid = await this.checkIfValidPositionUpdate(data, character, newX, newY, isMoving);
          }

          this.socketMessaging.sendEventToUser<ICharacterPositionUpdateConfirm>(
            character.channelId!,
            CharacterSocketEvents.CharacterPositionUpdateConfirm,
            {
              id: character.id,
              isValid: isPositionUpdateValid,
              direction: direction!,
            }
          );

          if (!isPositionUpdateValid) {
            return;
          }

          // bidirectional data retransmission
          await this.warnUsersAroundAboutEmitterPositionUpdate(character, data, direction!, isMoving);
          await this.warnEmitterAboutUsersAround(character, data, ["x", "y", "direction"], direction!, isMoving);

          await this.npcView.warnUserAboutNPCsInView(character, data.otherEntitiesInView);

          // update emitter position from connectedPlayers
          await this.updateServerSideEmitterInfo(data, character, newX, newY, isMoving, direction!);
        }
      }
    );
  }

  private async warnEmitterAboutUsersAround(
    character: ICharacter,
    dataFromClient: ICharacterPositionUpdateFromClient,
    keysToTriggerSync: string[],
    direction: AnimationDirection,
    isMoving: boolean
  ): Promise<void> {
    const nearbyCharacters = await this.characterView.getCharactersInView(character);

    for (const nearbyCharacter of nearbyCharacters) {
      let shouldWarnEmitter = false;

      const emitterEntityInClientView = character.otherEntitiesInView[nearbyCharacter.id];

      if (!emitterEntityInClientView) {
        shouldWarnEmitter = true;
      }

      for (const key of keysToTriggerSync) {
        if (emitterEntityInClientView[key] !== nearbyCharacter[key]) {
          shouldWarnEmitter = true;
        } else {
          console.log("representation in sync, skipping");
        }
      }

      if (shouldWarnEmitter) {
        const dataFromServer = {
          ...dataFromClient,
          x: character.x,
          y: character.y,
          name: character.name,
          direction,
          isMoving,
          layer: character.layer,
          channelId: character.channelId!,
        };

        this.socketMessaging.sendEventToUser<ICharacterPositionUpdateFromServer>(
          character.channelId!,
          CharacterSocketEvents.CharacterPositionUpdate,
          dataFromServer
        );
      }
    }
  }

  private async warnUsersAroundAboutEmitterPositionUpdate(
    character: ICharacter,
    data: ICharacterPositionUpdateFromClient,
    direction: AnimationDirection,
    isMoving: boolean
  ): Promise<void> {
    const nearbyCharacters = await this.characterView.getCharactersInView(character);

    for (const nearbyCharacter of nearbyCharacters) {
      const dataFromServer = {
        ...data,
        x: character.x,
        y: character.y,
        name: character.name,
        direction,
        isMoving,
        layer: character.layer,
        channelId: character.channelId!,
      };

      this.socketMessaging.sendEventToUser<ICharacterPositionUpdateFromServer>(
        nearbyCharacter.channelId!,
        CharacterSocketEvents.CharacterPositionUpdate,
        dataFromServer
      );
    }
  }

  private async checkIfValidPositionUpdate(
    data: ICharacterPositionUpdateFromClient,
    character: ICharacter,
    newX: number,
    newY: number,
    isMoving: boolean
  ): Promise<boolean> {
    if (!isMoving) {
      return true; // if character is not moving, we dont need to check anything else!
    }

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
    data: ICharacterPositionUpdateFromClient,
    character: ICharacter,
    newX: number,
    newY: number,
    isMoving: boolean,
    direction: AnimationDirection
  ): Promise<void> {
    const updatedData = data;
    const map = ScenesMetaData[character.scene].map;

    if (isMoving) {
      // if character is moving, update the position

      // old position is now walkable
      TilemapParser.grids.get(map)!.setWalkableAt(ToGridX(data.x), ToGridY(data.y), true);

      updatedData.x = newX;
      updatedData.y = newY;

      // remove self, if present
      data.otherEntitiesInView = _.omit(data.otherEntitiesInView, [character._id]);

      await Character.updateOne(
        { _id: character._id },
        {
          $set: {
            x: updatedData.x,
            y: updatedData.y,
            direction: direction,
            otherEntitiesInView: data.otherEntitiesInView,
          },
        }
      );

      // update our grid with solid information

      TilemapParser.grids.get(map)!.setWalkableAt(ToGridX(updatedData.x), ToGridY(updatedData.y), false);
    }
  }
}
