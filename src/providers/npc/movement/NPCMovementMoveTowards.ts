import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { appEnv } from "@providers/config/env";
import { Locker } from "@providers/locks/Locker";
import { MapHelper } from "@providers/map/MapHelper";
import { PathfindingCaching } from "@providers/map/PathfindingCaching";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  EntityAttackType,
  FromGridX,
  FromGridY,
  NPCAlignment,
  NPCMovementType,
  NPCPathOrientation,
  NPCSocketEvents,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _, { debounce } from "lodash";
import { NPC_BATTLE_CYCLES } from "../NPCBattleCycle";
import { NPCBattleCycleQueue } from "../NPCBattleCycleQueue";
import { NPCView } from "../NPCView";
import { NPCMovement } from "./NPCMovement";
import { NPCTarget } from "./NPCTarget";
export interface ICharacterHealth {
  id: string;
  health: number;
}

@provide(NPCMovementMoveTowards)
export class NPCMovementMoveTowards {
  debouncedFaceTarget: _.DebouncedFunc<(npc: INPC, targetCharacter: ICharacter) => Promise<void>>;
  constructor(
    private movementHelper: MovementHelper,
    private npcMovement: NPCMovement,
    private npcTarget: NPCTarget,
    private socketMessaging: SocketMessaging,
    private npcView: NPCView,
    private mapHelper: MapHelper,
    private pathfindingCaching: PathfindingCaching,
    private locker: Locker,
    private npcBattleCycleQueue: NPCBattleCycleQueue
  ) {}

  @TrackNewRelicTransaction()
  public async startMoveTowardsMovement(npc: INPC): Promise<void> {
    // first step is setting a target
    // for this, get all characters nearby and set the target to the closest one

    const targetCharacter = (await Character.findById(npc.targetCharacter)
      .lean()
      .select("_id x y scene health isOnline isBanned target")) as ICharacter;

    if (!targetCharacter) {
      // no target character

      await this.npcTarget.tryToSetTarget(npc);

      // if not target is set and we're out of X and Y position, just move back
      await this.moveBackToOriginalPosIfNoTarget(npc, targetCharacter);
    }

    if (targetCharacter) {
      if (targetCharacter.scene !== npc.scene) {
        await this.npcTarget.clearTarget(npc);
        return;
      }

      await this.npcTarget.tryToClearOutOfRangeTargets(npc);

      switch (npc.attackType) {
        case EntityAttackType.Melee:
          await this.initOrClearBattleCycle(npc, targetCharacter, 2);

          break;
        case EntityAttackType.Ranged:
        case EntityAttackType.MeleeRanged:
          await this.initOrClearBattleCycle(npc, targetCharacter, npc.maxRangeAttack);
          break;
      }

      await this.fleeIfHealthIsLow(npc);

      const reachedTarget = this.reachedTarget(npc, targetCharacter);

      if (reachedTarget) {
        if (npc.pathOrientation === NPCPathOrientation.Backward) {
          // if NPC is coming back from being lured, reset its orientation to Forward
          // npc.pathOrientation = NPCPathOrientation.Forward;
          // await npc.save();

          await NPC.updateOne({ _id: npc.id }, { pathOrientation: NPCPathOrientation.Forward });
        }

        if (appEnv.general.IS_UNIT_TEST) {
          await this.faceTarget(npc, targetCharacter);
        } else {
          this.debouncedFaceTarget = debounce(this.faceTarget, 300);

          await this.debouncedFaceTarget(npc, targetCharacter);
        }

        return;
      }

      // calculate distance to original position
      if (!npc.maxRangeInGridCells) {
        throw new Error(`NPC ${npc.id} has no maxRangeInGridCells set!`);
      }

      switch (npc.pathOrientation) {
        case NPCPathOrientation.Forward:
          if (!npc.maxAntiLuringRangeInGridCells) {
            throw new Error(`NPC ${npc.id} has no maxAntiLuringRangeInGridCells set!`);
          }

          const isUnderOriginalPositionRange = this.movementHelper.isUnderRange(
            npc.x,
            npc.y,
            npc.initialX,
            npc.initialY,
            npc.maxAntiLuringRangeInGridCells
          );

          if (isUnderOriginalPositionRange) {
            // if character is on the same scene as npc
            if (npc.scene === targetCharacter.scene) {
              await this.moveTowardsPosition(npc, targetCharacter, targetCharacter.x, targetCharacter.y);
            }
          } else {
            npc.pathOrientation = NPCPathOrientation.Backward;
            await NPC.updateOne({ _id: npc.id }, { pathOrientation: NPCPathOrientation.Backward });
          }
          break;
        case NPCPathOrientation.Backward:
          await this.moveTowardsPosition(npc, targetCharacter, npc.initialX, npc.initialY);

          break;
      }
    }
  }

  @TrackNewRelicTransaction()
  private async fleeIfHealthIsLow(npc: INPC): Promise<void> {
    if (npc.fleeOnLowHealth) {
      if (npc.health <= npc.maxHealth / 4) {
        await NPC.updateOne({ _id: npc._id }, { currentMovementType: NPCMovementType.MoveAway });
      }
    }
  }

  @TrackNewRelicTransaction()
  private async moveBackToOriginalPosIfNoTarget(npc: INPC, target: ICharacter): Promise<void> {
    if (
      !npc.targetCharacter &&
      !this.reachedInitialPosition(npc) &&
      npc.pathOrientation === NPCPathOrientation.Backward
    ) {
      await this.moveTowardsPosition(npc, target, npc.initialX, npc.initialY);
    }
  }

  @TrackNewRelicTransaction()
  private async initOrClearBattleCycle(
    npc: INPC,
    targetCharacter: ICharacter,

    maxRangeInGridCells
  ): Promise<void> {
    if (npc.alignment === NPCAlignment.Hostile) {
      // if melee, only start battle cycle if target is in melee range

      const isInRange = this.movementHelper.isUnderRange(
        npc.x,
        npc.y,
        targetCharacter.x,
        targetCharacter.y,
        maxRangeInGridCells
      );

      if (isInRange) {
        await this.initBattleCycle(npc);
      } else {
        const battleCycle = NPC_BATTLE_CYCLES.get(npc.id);

        if (battleCycle) {
          await battleCycle.clear();
        }
      }
    }
  }

  @TrackNewRelicTransaction()
  private async faceTarget(npc: INPC, targetCharacter: ICharacter): Promise<void> {
    if (!targetCharacter) {
      return;
    }

    const facingDirection = this.npcTarget.getTargetDirection(npc, targetCharacter.x, targetCharacter.y);

    await NPC.updateOne({ _id: npc.id }, { direction: facingDirection });

    const nearbyCharacters = await this.npcView.getCharactersInView(npc);

    // Filter characters needing updates based on the fetched client NPCs
    const charactersNeedingUpdates: ICharacter[] = nearbyCharacters.filter((nearbyCharacter) => {
      return nearbyCharacter?.direction !== facingDirection;
    });

    // Broadcast to all characters needing an update
    for (const character of charactersNeedingUpdates) {
      this.socketMessaging.sendEventToUser(character.channelId!, NPCSocketEvents.NPCDataUpdate, {
        id: npc.id,
        direction: npc.direction,
        x: npc.x,
        y: npc.y,
      });
    }
  }

  private reachedInitialPosition(npc: INPC): boolean {
    return npc.x === npc.initialX && npc.y === npc.initialY;
  }

  private reachedTarget(npc: INPC, targetCharacter: ICharacter): boolean {
    const reachedInitialPosition = this.reachedInitialPosition(npc);

    switch (npc.pathOrientation) {
      case NPCPathOrientation.Forward:
        return this.movementHelper.isUnderRange(npc.x, npc.y, targetCharacter.x, targetCharacter.y, 1);

      case NPCPathOrientation.Backward:
        return reachedInitialPosition;
    }

    return false;
  }

  @TrackNewRelicTransaction()
  private async initBattleCycle(npc: INPC): Promise<void> {
    const hasBattleCycle = NPC_BATTLE_CYCLES.has(npc.id);

    if (!npc.targetCharacter) {
      // try to reset target, if somehow its lost
      await this.npcTarget.tryToSetTarget(npc);
    }

    if (!hasBattleCycle) {
      const canProceed = await this.locker.lock(`npc-${npc._id}-npc-battle-cycle`);

      if (!canProceed) {
        return;
      }

      const npcSkills = (await Skill.findOne({
        _id: npc.skills,
      })
        .lean({ virtuals: true, defaults: true })
        .cacheQuery({
          cacheKey: `${npc.id}-skills`,
          ttl: 60 * 60 * 24 * 7,
        })) as ISkill;

      await this.npcBattleCycleQueue.add(npc, npcSkills);
    }
  }

  @TrackNewRelicTransaction()
  private async moveTowardsPosition(npc: INPC, target: ICharacter, x: number, y: number): Promise<void> {
    try {
      const shortestPath = await this.npcMovement.getShortestPathNextPosition(
        npc,
        target,
        ToGridX(npc.x),
        ToGridY(npc.y),
        ToGridX(x),
        ToGridY(y)
      );
      if (!shortestPath) {
        // throw new Error("No shortest path found!");
        // await this.npcTarget.clearTarget(npc);
        return;
      }
      const { newGridX, newGridY, nextMovementDirection } = shortestPath;
      const validCoordinates = this.mapHelper.areAllCoordinatesValid([newGridX, newGridY]);
      if (validCoordinates && nextMovementDirection) {
        const hasMoved = await this.npcMovement.moveNPC(
          npc,
          npc.x,
          npc.y,
          FromGridX(newGridX),
          FromGridY(newGridY),
          nextMovementDirection
        );

        if (!hasMoved) {
          // probably there's a solid on the way, lets clear the pathfinding caching to force a recalculation
          await this.pathfindingCaching.delete(npc.scene, {
            start: {
              x: ToGridX(npc.x),
              y: ToGridY(npc.y),
            },
            end: {
              x: ToGridX(x),
              y: ToGridY(y),
            },
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
