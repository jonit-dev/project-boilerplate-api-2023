import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { DataStructureHelper } from "@providers/dataStructures/DataStructuresHelper";
import { ItemView } from "@providers/item/ItemView";
import { GridManager } from "@providers/map/GridManager";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { MapTransition } from "@providers/map/MapTransition";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { NPCManager } from "@providers/npc/NPCManager";
import { NPCWarn } from "@providers/npc/NPCWarn";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  AnimationDirection,
  CharacterSocketEvents,
  ICharacterPositionUpdateConfirm,
  ICharacterPositionUpdateFromClient,
  ICharacterPositionUpdateFromServer,
  IUIShowMessage,
  MapLayers,
  ToGridX,
  ToGridY,
  UISocketEvents,
} from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import { CharacterBan } from "../CharacterBan";
import { CharacterValidation } from "../CharacterValidation";
import { CharacterView } from "../CharacterView";

@provide(CharacterNetworkUpdate)
export class CharacterNetworkUpdate {
  constructor(
    private socketMessaging: SocketMessaging,
    private socketAuth: SocketAuth,
    private movementHelper: MovementHelper,
    private itemView: ItemView,
    private characterView: CharacterView,
    private characterBan: CharacterBan,
    private objectHelper: DataStructureHelper,
    private mapTransition: MapTransition,
    private npcManager: NPCManager,
    private gridManager: GridManager,
    private mapNonPVPZone: MapNonPVPZone,
    private characterValidation: CharacterValidation,
    private npcWarn: NPCWarn
  ) {}

  public onCharacterUpdatePosition(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterPositionUpdate,
      async (data: ICharacterPositionUpdateFromClient, character: ICharacter) => {
        if (data) {
          // sometimes the character is just changing facing direction and not moving.. That's why we need this.
          const isMoving = this.movementHelper.isMoving(character.x, character.y, data.newX, data.newY);

          // send message back to the user telling that the requested position update is not valid!

          let isPositionUpdateValid = true;

          const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(
            character.x,
            character.y,
            data.direction
          );

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

          if (isPositionUpdateValid) {
            // bidirectional data retransmission
            await this.warnCharactersAroundAboutEmitterPositionUpdate(character, data);

            await this.npcWarn.warnCharacterAboutNPCsInView(character);

            await this.warnEmitterAboutCharactersAround(character);

            await this.npcManager.startNearbyNPCsBehaviorLoop(character);

            await this.itemView.warnCharacterAboutItemsInView(character);

            // update emitter position from
            await this.updateServerSideEmitterInfo(data, character, newX, newY, isMoving, data.direction);

            await this.handleMapTransition(character, newX, newY);

            this.handleNonPVPZone(character, newX, newY);
          }

          // lets make sure we send the confirmation back to the user only after all the other pre-requirements above are done.
          this.socketMessaging.sendEventToUser<ICharacterPositionUpdateConfirm>(
            character.channelId!,
            CharacterSocketEvents.CharacterPositionUpdateConfirm,
            {
              id: character.id,
              isValid: isPositionUpdateValid,
              direction: data.direction,
            }
          );
        }
      }
    );
  }

  private handleNonPVPZone(character: ICharacter, newX: number, newY: number): void {
    /* 
          Verify if we're in a non pvp zone. If so, we need to trigger 
          an attack stop event in case player was in a pvp combat
          */
    const nonPVPZone = this.mapNonPVPZone.getNonPVPZoneAtXY(character.scene, newX, newY);
    if (nonPVPZone) {
      this.mapNonPVPZone.stopCharacterAttack(character);
    }
  }

  private async handleMapTransition(character: ICharacter, newX: number, newY: number): Promise<void> {
    // verify if we're in a map transition. If so, we need to trigger a scene transition
    const transition = this.mapTransition.getTransitionAtXY(character.scene, newX, newY);
    if (transition) {
      const map = this.mapTransition.getTransitionProperty(transition, "map");
      const gridX = Number(this.mapTransition.getTransitionProperty(transition, "gridX"));
      const gridY = Number(this.mapTransition.getTransitionProperty(transition, "gridY"));

      if (!map || !gridX || !gridY) {
        console.error("Failed to fetch required destination properties.");
        return;
      }

      const destination = {
        map,
        gridX,
        gridY,
      };

      /*
   Check if we are transitioning to the same map, 
   if so we should only teleport the character
   */
      if (destination.map === character.scene) {
        await this.mapTransition.teleportCharacter(character, destination);
      } else {
        await this.mapTransition.changeCharacterScene(character, destination);
      }
    }
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
        textureKey: nearbyCharacter.textureKey,
      };

      this.socketMessaging.sendEventToUser<ICharacterPositionUpdateFromServer>(
        character.channelId!,
        CharacterSocketEvents.CharacterPositionUpdate,
        nearbyCharacterData
      );
    }
  }

  private shouldWarnCharacter(emitter: ICharacter, nearbyCharacter: ICharacter): boolean {
    const charOnCharView = emitter.view.characters[nearbyCharacter.id];

    if (!charOnCharView) {
      return true;
    }

    return false;
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
          character.x === nearbyCharEmitterRepresentation.x &&
          character.y === nearbyCharEmitterRepresentation.y &&
          clientPosUpdateData.direction === nearbyCharEmitterRepresentation.direction
        ) {
          continue;
        }
      }

      const dataFromServer = this.generateDataPayloadFromServer(clientPosUpdateData, character);

      await this.characterView.addToCharacterView(
        nearbyCharacter,
        {
          id: character.id,
          x: character.x,
          y: character.y,
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
    const isMoving = this.movementHelper.isMoving(character.x, character.y, dataFromClient.newX, dataFromClient.newY);

    return {
      ...dataFromClient,
      id: character.id,
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
      textureKey: character.textureKey,
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

    if (!this.movementHelper.isSnappedToGrid(newX, newY)) {
      console.log(`🚫 ${character.name} lost snapping to grid!`);
      return false;
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

    if (character.speed === 0) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Sorry, you're too heavy to move. Please drop something from your inventory.",
        type: "error",
      });
      return false;
    }

    this.characterValidation.hasBasicValidation(character);

    if (character.lastMovement) {
      const now = dayjs(new Date());
      const lastMovement = dayjs(character.lastMovement);
      const movementDiff = now.diff(lastMovement, "millisecond");


      // if character is trying to move 2x faster than the allowed interval, ban him
      if (movementDiff < character.movementIntervalMs / 2) {
        console.log(`🚫 ${character.name} tried to move too fast!`);
        await this.characterBan.addPenalty(character);
        return false;
      }
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
    const map = character.scene;

    const { gridOffsetX, gridOffsetY } = this.gridManager.getGridOffset(map)!;

    if (isMoving) {
      // if character is moving, update the position

      // old position is now walkable
      this.gridManager.setWalkable(map, ToGridX(character.x) + gridOffsetX, ToGridY(character.y) + gridOffsetY, true);

      await Character.updateOne(
        { _id: character._id },
        {
          $set: {
            x: newX,
            y: newY,
            direction: direction,
            lastMovement: new Date(),
          },
        }
      );

      // update our grid with solid information

      this.gridManager.setWalkable(map, ToGridX(newX) + gridOffsetX, ToGridY(newY) + gridOffsetY, false);
    }
  }
}
