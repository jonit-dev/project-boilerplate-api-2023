import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { DataStructureHelper } from "@providers/dataStructures/DataStructuresHelper";
import { ItemView } from "@providers/item/ItemView";
import { MapLoader } from "@providers/map/MapLoader";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { NPCView } from "@providers/npc/NPCView";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  AnimationDirection,
  CharacterSocketEvents,
  ICharacterPositionUpdateConfirm,
  ICharacterPositionUpdateFromClient,
  ICharacterPositionUpdateFromServer,
  MapLayers,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import { CharacterBan } from "../CharacterBan";
import { CharacterView } from "../CharacterView";

@provide(CharacterNetworkUpdate)
export class CharacterNetworkUpdate {
  constructor(
    private socketMessaging: SocketMessaging,
    private socketAuth: SocketAuth,
    private movementHelper: MovementHelper,
    private npcView: NPCView,
    private itemView: ItemView,
    private characterView: CharacterView,
    private characterBan: CharacterBan,
    private objectHelper: DataStructureHelper
  ) {}

  public onCharacterUpdatePosition(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterPositionUpdate,
      async (data: ICharacterPositionUpdateFromClient, character: ICharacter) => {
        if (data) {
          const isMoving = this.movementHelper.isMoving(data.x, data.y, data.newX, data.newY);

          // send message back to the user telling that the requested position update is not valid!

          let isPositionUpdateValid = true;

          const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(data.x, data.y, data.direction);

          if (isMoving) {
            isPositionUpdateValid = await this.checkIfValidPositionUpdate(
              data,
              character,
              newX,
              newY,
              isMoving,
              data.direction
            );
          }

          this.socketMessaging.sendEventToUser<ICharacterPositionUpdateConfirm>(
            character.channelId!,
            CharacterSocketEvents.CharacterPositionUpdateConfirm,
            {
              id: character.id,
              isValid: isPositionUpdateValid,
              direction: data.direction,
            }
          );

          if (!isPositionUpdateValid) {
            return;
          }

          // bidirectional data retransmission
          await this.warnCharactersAroundAboutEmitterPositionUpdate(character, data);
          await this.warnEmitterAboutCharactersAround(character);

          await this.npcView.warnCharacterAboutNPCsInView(character);

          await this.itemView.warnCharacterAboutItemsInView(character);

          // update emitter position from connectedPlayers
          await this.updateServerSideEmitterInfo(data, character, newX, newY, isMoving, data.direction);
        }
      }
    );
  }

  private async warnEmitterAboutCharactersAround(character: ICharacter): Promise<void> {
    const nearbyCharacters = await this.characterView.getCharactersInView(character);

    for (const nearbyCharacter of nearbyCharacters) {
      if (!this.shouldWarnCharacter(character, nearbyCharacter)) {
        continue;
      }

      await this.characterView.addToCharacterView(
        character,
        {
          id: nearbyCharacter.id,
          x: nearbyCharacter.x,
          y: nearbyCharacter.y,
          direction: nearbyCharacter.direction,
          scene: nearbyCharacter.scene,
        },
        "characters"
      );

      const nearbyCharacterData: ICharacterPositionUpdateFromServer = {
        id: nearbyCharacter.id,
        name: nearbyCharacter.name,
        x: nearbyCharacter.x,
        y: nearbyCharacter.y,
        newX: nearbyCharacter.x,
        newY: nearbyCharacter.y,
        channelId: nearbyCharacter.channelId!,
        direction: nearbyCharacter.direction as AnimationDirection,
        layer: nearbyCharacter.layer,
        isMoving: false,
        speed: nearbyCharacter.speed,
        movementIntervalMs: nearbyCharacter.movementIntervalMs,
        health: nearbyCharacter.health,
        maxHealth: nearbyCharacter.maxHealth,
        mana: nearbyCharacter.mana,
        maxMana: nearbyCharacter.maxMana,
      };

      this.socketMessaging.sendEventToUser<ICharacterPositionUpdateFromServer>(
        character.channelId!,
        CharacterSocketEvents.CharacterPositionUpdate,
        nearbyCharacterData
      );
    }
  }

  private shouldWarnCharacter(
    emitter: ICharacter,
    nearbyCharacter: ICharacter | ICharacterPositionUpdateFromClient
  ): boolean {
    const charOnCharView = emitter.view.characters[nearbyCharacter.id];

    // if we already have a representation there, just skip!
    if (charOnCharView) {
      const doesServerCharMatchesClientChar = this.objectHelper.doesObjectAttrMatches(charOnCharView, nearbyCharacter, [
        "id",
        "x",
        "y",
        "direction",
        "scene",
      ]);

      if (doesServerCharMatchesClientChar) {
        return false;
      }
    }

    return true;
  }

  private async warnCharactersAroundAboutEmitterPositionUpdate(
    character: ICharacter,
    clientPosUpdateData: ICharacterPositionUpdateFromClient
  ): Promise<void> {
    const nearbyCharacters = await this.characterView.getCharactersInView(character);

    for (const nearbyCharacter of nearbyCharacters) {
      // we should only warn the nearby char, if there's a mismatch between what he's actually seeing (nearbyCharacter) vs clientPosUpdateData (latest emitter update). This is needed to avoid sending unnecessary data to the client.
      const nearbyCharEmitterRepresentation = nearbyCharacter.view.characters[character.id];
      if (nearbyCharEmitterRepresentation) {
        if (
          clientPosUpdateData.x === nearbyCharEmitterRepresentation.x &&
          clientPosUpdateData.y === nearbyCharEmitterRepresentation.y &&
          clientPosUpdateData.direction === nearbyCharEmitterRepresentation.direction
        ) {
          continue;
        }
      }

      const dataFromServer = this.generateDataPayloadFromServer(clientPosUpdateData, character);

      await this.characterView.addToCharacterView(
        nearbyCharacter,
        {
          id: clientPosUpdateData.id,
          x: clientPosUpdateData.x,
          y: clientPosUpdateData.y,
          direction: clientPosUpdateData.direction,
          scene: character.scene,
        },
        "characters"
      );

      this.socketMessaging.sendEventToUser<ICharacterPositionUpdateFromServer>(
        nearbyCharacter.channelId!,
        CharacterSocketEvents.CharacterPositionUpdate,
        dataFromServer
      );
    }
  }

  private generateDataPayloadFromServer(
    dataFromClient: ICharacterPositionUpdateFromClient,
    character: ICharacter
  ): ICharacterPositionUpdateFromServer {
    const isMoving = this.movementHelper.isMoving(
      dataFromClient.x,
      dataFromClient.y,
      dataFromClient.newX,
      dataFromClient.newY
    );

    return {
      ...dataFromClient,
      x: character.x,
      y: character.y,
      name: character.name,
      direction: dataFromClient.direction,
      isMoving,
      layer: character.layer,
      channelId: character.channelId!,
      speed: character.speed,
      movementIntervalMs: character.movementIntervalMs,
      health: character.health,
      maxHealth: character.maxHealth,
      mana: character.mana,
      maxMana: character.maxMana,
    };
  }

  private async checkIfValidPositionUpdate(
    data: ICharacterPositionUpdateFromClient,
    character: ICharacter,
    newX: number,
    newY: number,
    isMoving: boolean,
    clientDirection: AnimationDirection
  ): Promise<boolean> {
    if (!isMoving) {
      return true; // if character is not moving, we dont need to check anything else!
    }

    const isSolid = await this.movementHelper.isSolid(
      character.scene,
      ToGridX(newX),
      ToGridY(newY),
      MapLayers.Character
    );

    if (isSolid) {
      return false;
    }

    if (!character.isOnline) {
      console.log(`🚫 ${character.name} tried to move while offline!`);
      return false;
    }

    if (!character.isAlive) {
      console.log(`🚫 ${character.name} tried to move while dead!`);
      return false;
    }

    if (character.isBanned) {
      console.log(`🚫 ${character.name} tried to move while banned!`);

      this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
        reason: "You cannot use this character while banned.",
      });

      return false;
    }

    const serverCalculatedDirection = this.movementHelper.getGridMovementDirection(
      ToGridX(data.x),
      ToGridY(data.y),
      ToGridX(data.newX),
      ToGridY(data.newY)
    );

    if (clientDirection !== serverCalculatedDirection) {
      console.log(`🚫 ${character.name} tried to move in a wrong facing direction!`);
      return false;
    }

    if (character.lastMovement) {
      const now = dayjs(new Date());
      const lastMovement = dayjs(character.lastMovement);
      const movementDiff = now.diff(lastMovement, "millisecond");

      if (movementDiff < character.movementIntervalMs) {
        console.log(`🚫 ${character.name} tried to move too fast!`);
        await this.characterBan.addPenalty(character);
        return false;
      }
    }

    if (Math.round(character.x) !== Math.round(data.x) && Math.round(character.y) !== Math.round(data.y)) {
      console.log(`🚫 ${character.name} tried to move from a different origin position`);

      return false; // mismatch between client and server position
    }

    return true;
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
    const map = character.scene;

    if (isMoving) {
      // if character is moving, update the position

      // old position is now walkable
      MapLoader.grids.get(map)!.setWalkableAt(ToGridX(data.x), ToGridY(data.y), true);

      updatedData.x = newX;
      updatedData.y = newY;

      await Character.updateOne(
        { _id: character._id },
        {
          $set: {
            x: updatedData.x,
            y: updatedData.y,
            direction: direction,
            lastMovement: new Date(),
          },
        }
      );

      // update our grid with solid information

      MapLoader.grids.get(map)!.setWalkableAt(ToGridX(updatedData.x), ToGridY(updatedData.y), false);
    }
  }
}
