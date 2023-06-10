/* eslint-disable require-await */
/* eslint-disable no-void */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { appEnv } from "@providers/config/env";
import { GridManager } from "@providers/map/GridManager";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { MapTransition } from "@providers/map/MapTransition";
import { MathHelper } from "@providers/math/MathHelper";
import { IPosition, MovementHelper } from "@providers/movement/MovementHelper";
import { NPCManager } from "@providers/npc/NPCManager";
import { PM2Helper } from "@providers/server/PM2Helper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  AnimationDirection,
  CharacterSocketEvents,
  EnvType,
  GRID_WIDTH,
  ICharacterPositionUpdateConfirm,
  ICharacterPositionUpdateFromClient,
  ICharacterSyncPosition,
  NPCAlignment,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

import { NPC } from "@entities/ModuleNPC/NPCModel";
import { Queue, QueueEvents, Worker } from "bullmq";
import { CharacterView } from "../CharacterView";
import { CharacterMovementValidation } from "../characterMovement/CharacterMovementValidation";
import { CharacterMovementWarn } from "../characterMovement/CharacterMovementWarn";

@provide(CharacterNetworkUpdate)
export class CharacterNetworkUpdate {
  private queue: Queue;
  private worker: Worker;
  private queueEvents: QueueEvents;

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
    private mathHelper: MathHelper,
    private characterView: CharacterView,
    private pm2Helper: PM2Helper
  ) {
    this.queue = new Queue("CharacterNetworkUpdate", {
      connection: {
        host: appEnv.database.REDIS_CONTAINER,
        port: Number(appEnv.database.REDIS_PORT),
      },
    });

    this.worker = new Worker(
      "CharacterNetworkUpdate",
      async (job) => {
        const { data, character } = job.data;

        try {
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
              isPositionUpdateValid = await this.characterMovementValidation.isValid(character, newX, newY, isMoving);
            }

            if (isPositionUpdateValid) {
              const serverCharacterPosition = {
                x: character.x,
                y: character.y,
              };

              await this.syncIfPositionMismatch(character, serverCharacterPosition, data.originX, data.originY);

              await this.characterMovementWarn.warn(character, data);

              switch (appEnv.general.ENV) {
                case EnvType.Development:
                  // eslint-disable-next-line @typescript-eslint/no-floating-promises
                  this.npcManager.startNearbyNPCsBehaviorLoop(character);

                  break;
                case EnvType.Production: // This allocates a random CPU in charge of this NPC behavior in prod
                  this.pm2Helper.sendEventToRandomCPUInstance("startNPCBehavior", {
                    character,
                  });
                  break;
              }

              await this.updateServerSideEmitterInfo(character, newX, newY, isMoving, data.direction);

              await this.handleNonPVPZone(character, newX, newY);

              // leave it for last!
              await this.handleMapTransition(character, newX, newY);

              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              this.characterView.clearAllOutOfViewElements(character);
            }

            this.sendConfirmation(character, data.direction, isPositionUpdateValid);
          }
        } catch (error) {
          console.error(error);
        }
      },
      {
        connection: {
          host: appEnv.database.REDIS_CONTAINER,
          port: Number(appEnv.database.REDIS_PORT),
        },
      }
    );

    this.worker.on("failed", (job, err) => {
      console.log(`Job ${job?.id} failed with error ${err.message}`);
    });
  }

  public onCharacterUpdatePosition(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterPositionUpdate,
      async (data: ICharacterPositionUpdateFromClient, character: ICharacter) => {
        void this.queue.add("CharacterNetworkUpdate", {
          data,
          character,
        });
      }
    );
  }

  private sendConfirmation(character: ICharacter, direction: AnimationDirection, isPositionUpdateValid: boolean): void {
    // lets make sure we send the confirmation back to the user only after all the other pre-requirements above are done.
    this.socketMessaging.sendEventToUser<ICharacterPositionUpdateConfirm>(
      character.channelId!,
      CharacterSocketEvents.CharacterPositionUpdateConfirm,
      {
        id: character.id,
        isValid: isPositionUpdateValid,
        position: {
          originX: character.x,
          originY: character.y,
          direction: direction,
        },
      }
    );
  }

  private async syncIfPositionMismatch(
    serverCharacter: ICharacter,
    serverCharacterPosition: IPosition,
    clientOriginX: number,
    clientOriginY: number
  ): Promise<void> {
    const distance = this.mathHelper.getDistanceBetweenPoints(
      serverCharacterPosition.x,
      serverCharacterPosition.y,
      clientOriginX,
      clientOriginY
    );

    const distanceInGridCells = Math.round(distance / GRID_WIDTH);

    if (distanceInGridCells >= 1) {
      await Character.updateOne(
        { id: serverCharacter.id },
        {
          x: clientOriginX,
          y: clientOriginY,
        }
      );
    }

    if (distanceInGridCells >= 10) {
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

  private async handleNonPVPZone(character: ICharacter, newX: number, newY: number): Promise<void> {
    if (!character.target?.id) {
      return;
    }

    if (String(character.target.type) === "NPC") {
      const npc = await NPC.findById(character.target.id).lean();

      if (npc?.alignment !== NPCAlignment.Friendly) {
        return;
      }
    }

    /* 
          Verify if we're in a non pvp zone. If so, we need to trigger 
          an attack stop event in case player was in a pvp combat
          */
    const nonPVPZone = this.mapNonPVPZone.isNonPVPZoneAtXY(character.scene, newX, newY);
    if (nonPVPZone) {
      this.mapNonPVPZone.stopCharacterAttack(character);
    }
  }

  private async handleMapTransition(character: ICharacter, newX: number, newY: number): Promise<void> {
    const frozenCharacter = Object.freeze(character);

    // verify if we're in a map transition. If so, we need to trigger a scene transition
    const transition = this.mapTransition.getTransitionAtXY(frozenCharacter.scene, newX, newY);
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

      if (destination.map === frozenCharacter.scene) {
        await this.mapTransition.sameMapTeleport(frozenCharacter, destination);
      } else {
        await this.mapTransition.changeCharacterScene(frozenCharacter, destination);
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

    if (isMoving) {
      // if character is moving, update the position

      // old position is now walkable
      await this.gridManager.setWalkable(map, ToGridX(character.x), ToGridY(character.y), true);

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

      await this.gridManager.setWalkable(map, ToGridX(newX), ToGridY(newY), false);
    }
  }
}
