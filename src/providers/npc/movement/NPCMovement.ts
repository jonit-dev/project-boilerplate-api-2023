import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { appEnv } from "@providers/config/env";
import { NPC_CAN_ATTACK_IN_NON_PVP_ZONE } from "@providers/constants/NPCConstants";
import { PATHFINDING_MAX_TRIES } from "@providers/constants/PathfindingConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { GridManager } from "@providers/map/GridManager";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { Pathfinder } from "@providers/map/Pathfinder";
import { PathfindingQueue } from "@providers/map/PathfindingQueue";
import { PathfindingResults } from "@providers/map/PathfindingResults";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { INPCPositionUpdatePayload, NPCAlignment, NPCSocketEvents, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCView } from "../NPCView";
import { NPCWarn } from "../NPCWarn";
import { NPCTarget } from "./NPCTarget";

export type NPCDirection = "up" | "down" | "left" | "right";

interface IShortestPathPositionResult {
  newGridX: number;
  newGridY: number;
  nextMovementDirection: NPCDirection;
}

@provide(NPCMovement)
export class NPCMovement {
  constructor(
    private socketMessaging: SocketMessaging,
    private npcView: NPCView,
    private movementHelper: MovementHelper,
    private gridManager: GridManager,
    private mapNonPVPZone: MapNonPVPZone,
    private npcTarget: NPCTarget,
    private characterView: CharacterView,
    private npcWarn: NPCWarn,
    private specialEffect: SpecialEffect,
    private inMemoryHashTable: InMemoryHashTable,
    private pathfindingQueue: PathfindingQueue,
    private pathfindingResults: PathfindingResults,
    private pathfinder: Pathfinder
  ) {}

  public isNPCAtPathPosition(npc: INPC, gridX: number, gridY: number): boolean {
    if (ToGridX(npc.x) === gridX && ToGridY(npc.y) === gridY) {
      return true;
    }

    return false;
  }

  public async moveNPC(
    npc: INPC,
    oldX: number,
    oldY: number,
    newX: number,
    newY: number,
    chosenMovementDirection: NPCDirection
  ): Promise<boolean> {
    try {
      const map = npc.scene;

      const newGridX = ToGridX(newX);
      const newGridY = ToGridY(newY);

      // store previous npc position. We'll use this to avoid circular dependencies while using the pathfinding cache.
      await this.inMemoryHashTable.set("npc-previous-position", npc.id, [ToGridX(oldX), ToGridY(oldY)]);

      // check if max range is reached
      const hasSolid = await this.movementHelper.isSolid(
        map,
        newGridX,
        newGridY,
        npc.layer,
        "CHECK_ALL_LAYERS_BELOW",
        npc
      );

      if (hasSolid) {
        // console.log(`${npc.key} tried to move to ${newGridX}, ${newGridY}, but it's solid`);
        await this.gridManager.setWalkable(map, ToGridX(newX), ToGridY(newY), false);
        return false;
      }

      await Promise.all([
        this.gridManager.setWalkable(map, ToGridX(oldX), ToGridY(oldY), true),
        this.gridManager.setWalkable(map, ToGridX(newX), ToGridY(newY), false),
      ]);

      // warn nearby characters that the NPC moved;
      const nearbyCharacters = await this.npcView.getCharactersInView(npc);

      for (const character of nearbyCharacters) {
        let clearTarget = false;

        const isRaid = npc.raidKey !== undefined;
        const freeze = !isRaid;

        if (!NPC_CAN_ATTACK_IN_NON_PVP_ZONE && freeze) {
          const isCharInNonPVPZone = this.mapNonPVPZone.isNonPVPZoneAtXY(character.scene, character.x, character.y);

          /*
          This is to prevent the NPC from attacking the player if they are in a non-PVP zone.
          And when the player leaves the zone, the NPC will attack them again.
          */

          if (isCharInNonPVPZone && npc.alignment === NPCAlignment.Hostile) {
            clearTarget = true;
          }
        }

        if (!clearTarget) {
          clearTarget = await this.specialEffect.isInvisible(character);
        }

        if (clearTarget) {
          await this.npcTarget.clearTarget(npc);
        }

        const isOnCharView = await this.characterView.isOnCharacterView(character._id, npc._id, "npcs");

        if (!isOnCharView) {
          await this.npcWarn.warnCharacterAboutSingleNPCCreation(npc, character);
        } else {
          this.socketMessaging.sendEventToUser<INPCPositionUpdatePayload>(
            character.channelId!,
            NPCSocketEvents.NPCPositionUpdate,
            {
              id: npc.id,
              x: npc.x,
              y: npc.y,
              direction: chosenMovementDirection,
              alignment: npc.alignment as NPCAlignment,
            }
          );
        }
      }

      // use updateOne
      await NPC.updateOne({ _id: npc._id }, { x: newX, y: newY, direction: chosenMovementDirection });

      return true;
    } catch (error) {
      console.error(error);
    }

    return false;
  }

  public async getShortestPathNextPosition(
    npc: INPC,
    target: ICharacter | null,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): Promise<IShortestPathPositionResult | undefined> {
    try {
      let npcPath;
      if (appEnv.general.IS_UNIT_TEST) {
        npcPath = await this.pathfinder.findShortestPath(
          npc,
          target,
          npc.scene,
          startGridX,
          startGridY,
          endGridX,
          endGridY
        );
      } else {
        const job = await this.pathfindingQueue.addPathfindingJob(
          npc,
          target,
          startGridX,
          startGridY,
          endGridX,
          endGridY
        );
        npcPath = await this.pathfinderPoller(job.id!);
      }

      if (!npcPath?.length) {
        return;
        // throw new Error("Failed to calculate shortest path! No output!");
      }

      // get first next available position
      const [newGridX, newGridY] = npcPath[1] ?? npcPath[0]; // 0 would be the cached path. Remember that we store only the next step on the cache.

      if (!newGridX || !newGridY) {
        return;
      }

      const nextMovementDirection = this.movementHelper.getGridMovementDirection(
        ToGridX(npc.x),
        ToGridY(npc.y),
        newGridX,
        newGridY
      );

      if (!nextMovementDirection) {
        return;
        // throw new Error(`Failed to calculate nextMovement for NPC ${npc.key}`);
      }

      return {
        newGridX,
        newGridY,
        nextMovementDirection,
      };
    } catch (error) {
      console.error(`❌ Error while trying to move NPC key: ${npc.key} at ${npc.x}, ${npc.y} - map ${npc.scene}`);
      console.error(error);
    }
  }

  private pathfinderPoller(jobId: string): Promise<number[][]> {
    if (!jobId) {
      throw new Error("Job ID is required!");
    }

    return new Promise((resolve, reject) => {
      try {
        let tries = 0;

        const interval = setInterval(async () => {
          const npcPath = await this.pathfindingResults.getResult(jobId);

          if (npcPath) {
            clearInterval(interval);

            await this.pathfindingResults.deleteResult(jobId);

            resolve(npcPath);
          }

          tries++;

          if (tries > PATHFINDING_MAX_TRIES) {
            clearInterval(interval);
            await this.pathfindingResults.deleteResult(jobId);

            reject(new Error("Error while trying to fetch pathfinding result for NPC. Timeout!"));
          }
        }, 1);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
