import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { GridManager } from "@providers/map/GridManager";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { MapTransition } from "@providers/map/MapTransition";
import { MathHelper } from "@providers/math/MathHelper";
import { IPosition, MovementHelper } from "@providers/movement/MovementHelper";
import { NPCManager } from "@providers/npc/NPCManager";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  AnimationDirection,
  CharacterSocketEvents,
  GRID_WIDTH,
  ICharacterPositionUpdateConfirm,
  ICharacterPositionUpdateFromClient,
  ICharacterSyncPosition,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterMovementValidation } from "../characterMovement/CharacterMovementValidation";
import { CharacterMovementWarn } from "../characterMovement/CharacterMovementWarn";

@provide(CharacterNetworkUpdate)
export class CharacterNetworkUpdate {
  constructor(
    private socketMessaging: SocketMessaging,
    private socketAuth: SocketAuth,
    private movementHelper: MovementHelper,
    private mapTransition: MapTransition,
    private npcManager: NPCManager,
    private gridManager: GridManager,
    private mapNonPVPZone: MapNonPVPZone,
    private characterMovementValidation: CharacterMovementValidation,
    private characterMovementWarn: CharacterMovementWarn,
    private mathHelper: MathHelper
  ) {}

  public onCharacterUpdatePosition(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterPositionUpdate,
      async (data: ICharacterPositionUpdateFromClient, character: ICharacter) => {
        if (data) {
          console.log("================== PERFORMANCE ===================");
          // sometimes the character is just changing facing direction and not moving.. That's why we need this.
          console.time("isMoving");
          const isMoving = this.movementHelper.isMoving(character.x, character.y, data.newX, data.newY);
          console.timeEnd("isMoving");

          // send message back to the user telling that the requested position update is not valid!

          let isPositionUpdateValid = true;

          const serverCharacterPosition = {
            x: character.x,
            y: character.y,
          };

          console.time("syncIfPositionMismatch");
          this.syncIfPositionMismatch(character, serverCharacterPosition, data.originX, data.originY);
          console.timeEnd("syncIfPositionMismatch");

          const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(
            character.x,
            character.y,
            data.direction
          );

          if (isMoving) {
            console.time("isValid");
            isPositionUpdateValid = await this.characterMovementValidation.isValid(character, newX, newY, isMoving);
            console.timeEnd("isValid");
          }

          if (isPositionUpdateValid) {
            console.time("warn");
            await this.characterMovementWarn.warn(character, data);
            console.timeEnd("warn");

            console.time("startNearbyNPCsBehaviorLoop");
            await this.npcManager.startNearbyNPCsBehaviorLoop(character);
            console.timeEnd("startNearbyNPCsBehaviorLoop");

            // update emitter position from
            console.time("updateServerSideEmitterInfo");
            await this.updateServerSideEmitterInfo(character, newX, newY, isMoving, data.direction);
            console.timeEnd("updateServerSideEmitterInfo");

            console.time("handleMapTransition");
            await this.handleMapTransition(character, newX, newY);
            console.timeEnd("handleMapTransition");

            console.time("handleNonPVPZone");
            this.handleNonPVPZone(character, newX, newY);
            console.timeEnd("handleNonPVPZone");
          }

          // lets make sure we send the confirmation back to the user only after all the other pre-requirements above are done.
          console.time("sendEventToUser");
          this.socketMessaging.sendEventToUser<ICharacterPositionUpdateConfirm>(
            character.channelId!,
            CharacterSocketEvents.CharacterPositionUpdateConfirm,
            {
              id: character.id,
              isValid: isPositionUpdateValid,
              position: {
                originX: character.x,
                originY: character.y,
                direction: data.direction,
              },
            }
          );
          console.timeEnd("sendEventToUser");
        }
      }
    );
  }

  private syncIfPositionMismatch(
    serverCharacter: ICharacter,
    serverCharacterPosition: IPosition,
    clientOriginX: number,
    clientOriginY: number
  ): void {
    const distance = this.mathHelper.getDistanceBetweenPoints(
      serverCharacterPosition.x,
      serverCharacterPosition.y,
      clientOriginX,
      clientOriginY
    );

    const distanceInGridCells = Math.round(distance / GRID_WIDTH);

    if (distanceInGridCells >= 1) {
      this.socketMessaging.sendEventToUser<ICharacterSyncPosition>(
        serverCharacter.channelId!,
        CharacterSocketEvents.CharacterSyncPosition,
        {
          id: serverCharacter.id,
          position: {
            originX: serverCharacter.x,
            originY: serverCharacter.y,
            direction: serverCharacter.direction as AnimationDirection,
          },
        }
      );
    }
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

  private async updateServerSideEmitterInfo(
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
