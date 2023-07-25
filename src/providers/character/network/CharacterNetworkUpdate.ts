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
import { NewRelic } from "@providers/analytics/NewRelic";
import { NewRelicMetricCategory, NewRelicSubCategory } from "@providers/types/NewRelicTypes";
import dayjs from "dayjs";
import random from "lodash/random";
import { CharacterView } from "../CharacterView";
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
    private mathHelper: MathHelper,
    private characterView: CharacterView,
    private pm2Helper: PM2Helper,
    private newRelic: NewRelic
  ) {}

  public onCharacterUpdatePosition(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterPositionUpdate,
      async (data: ICharacterPositionUpdateFromClient, character: ICharacter) => {
        try {
          if (data) {
            // sometimes the character is just changing facing direction and not moving.. That's why we need this.
            const isMoving = this.movementHelper.isMoving(character.x, character.y, data.newX, data.newY);

            // send message back to the user telling that the requested position update is not valid!

            let isPositionUpdateValid = true;

            const { newX, newY, timestamp } = data;

            if (timestamp) {
              const n = random(1, 100);

              if (n <= 10) {
                // 10% chance tracking ping
                const ping = dayjs().diff(dayjs(timestamp), "ms");

                if (ping < 0) {
                  return; // invalid ping
                }

                this.newRelic.trackMetric(
                  NewRelicMetricCategory.Count,
                  NewRelicSubCategory.Characters,
                  "Character/Ping",
                  ping
                );
              }
            }

            if (isMoving) {
              isPositionUpdateValid = await this.characterMovementValidation.isValid(character, newX, newY, isMoving);
            }

            if (isPositionUpdateValid) {
              const serverCharacterPosition = {
                x: character.x,
                y: character.y,
              };

              await this.syncIfPositionMismatch(character, serverCharacterPosition, data.originX, data.originY);

              void this.characterMovementWarn.warn(character, data);

              switch (appEnv.general.ENV) {
                case EnvType.Development:
                  void this.npcManager.startNearbyNPCsBehaviorLoop(character);

                  break;
                case EnvType.Production: // This allocates a random CPU in charge of this NPC behavior in prod
                  void this.pm2Helper.sendEventToRandomCPUInstance("startNPCBehavior", {
                    character,
                  });
                  break;
              }

              await this.updateServerSideEmitterInfo(character, newX, newY, isMoving, data.direction);

              void this.handleNonPVPZone(character, newX, newY);

              // leave it for last!
              void this.handleMapTransition(character, newX, newY);

              void this.characterView.clearAllOutOfViewElements(character._id, character.x, character.y);
            }

            this.sendConfirmation(character, data.direction, isPositionUpdateValid);
          }
        } catch (error) {
          console.error(error);
        }
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
    const distance = this.mathHelper.getDistanceInGridCells(
      serverCharacterPosition.x,
      serverCharacterPosition.y,
      clientOriginX,
      clientOriginY
    );

    const distanceInGridCells = Math.round(distance / GRID_WIDTH);

    if (distanceInGridCells >= 1) {
      this.newRelic.trackMetric(
        NewRelicMetricCategory.Count,
        NewRelicSubCategory.Characters,
        "Desync/GridDesyncDistanceInCells",
        distanceInGridCells
      );

      await Character.updateOne(
        { id: serverCharacter.id },
        {
          x: clientOriginX,
          y: clientOriginY,
        }
      ).lean();
    }

    if (distanceInGridCells >= 10) {
      this.newRelic.trackMetric(
        NewRelicMetricCategory.Count,
        NewRelicSubCategory.Characters,
        "Desync/GridDesyncHighDistanceInCells",
        distanceInGridCells
      );

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
      const setOldPositionWalkable = this.gridManager.setWalkable(
        map,
        ToGridX(character.x),
        ToGridY(character.y),
        true
      );

      const characterUpdate = Character.updateOne(
        { _id: character._id },
        {
          $set: {
            x: newX,
            y: newY,
            direction: direction,
            lastMovement: new Date(),
          },
        }
      ).lean();

      // update our grid with solid information
      const setNewPositionSolid = this.gridManager.setWalkable(map, ToGridX(newX), ToGridY(newY), false);

      await Promise.all([setOldPositionWalkable, characterUpdate, setNewPositionSolid]);
    }
  }
}
