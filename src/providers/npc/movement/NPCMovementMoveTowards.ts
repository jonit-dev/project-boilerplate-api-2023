import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { BattleAttackTarget } from "@providers/battle/BattleAttackTarget/BattleAttackTarget";
import { CharacterView } from "@providers/character/CharacterView";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { MapHelper } from "@providers/map/MapHelper";
import { PathfindingCaching } from "@providers/map/PathfindingCaching";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
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
import _ from "lodash";
import { NPCBattleCycle, NPC_BATTLE_CYCLES } from "../NPCBattleCycle";
import { NPCView } from "../NPCView";
import { NPCMovement } from "./NPCMovement";
import { NPCTarget } from "./NPCTarget";

export interface ICharacterHealth {
  id: string;
  health: number;
}

@provide(NPCMovementMoveTowards)
export class NPCMovementMoveTowards {
  constructor(
    private movementHelper: MovementHelper,
    private npcMovement: NPCMovement,
    private npcTarget: NPCTarget,
    private battleAttackTarget: BattleAttackTarget,
    private socketMessaging: SocketMessaging,
    private npcView: NPCView,
    private mapHelper: MapHelper,
    private characterView: CharacterView,
    private specialEffect: SpecialEffect,
    private pathfindingCaching: PathfindingCaching,
    private newRelic: NewRelic,
    private characterRepository: CharacterRepository
  ) {}

  public async startMoveTowardsMovement(npc: INPC): Promise<void> {
    if (!npc.targetCharacter) {
      await this.npcTarget.tryToSetTarget(npc);
      return;
    }

    // first step is setting a target
    // for this, get all characters nearby and set the target to the closest one

    const targetCharacter = (await this.characterRepository.findById(npc.targetCharacter!.toString(), {
      leanType: "lean",
    })) as ICharacter;

    if (!targetCharacter) {
      // no target character

      await this.npcTarget.tryToSetTarget(npc);

      // if not target is set and we're out of X and Y position, just move back
      await this.moveBackToOriginalPosIfNoTarget(npc);
    }

    if (targetCharacter) {
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

        await this.faceTarget(npc);

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
              await this.moveTowardsPosition(npc, targetCharacter.x, targetCharacter.y);
            }
          } else {
            npc.pathOrientation = NPCPathOrientation.Backward;
            await NPC.updateOne({ _id: npc.id }, { pathOrientation: NPCPathOrientation.Backward });
          }
          break;
        case NPCPathOrientation.Backward:
          await this.moveTowardsPosition(npc, npc.initialX, npc.initialY);

          break;
      }
    }
  }

  private async fleeIfHealthIsLow(npc: INPC): Promise<void> {
    if (npc.fleeOnLowHealth) {
      if (npc.health <= npc.maxHealth / 4) {
        await NPC.updateOne({ _id: npc._id }, { currentMovementType: NPCMovementType.MoveAway });
      }
    }
  }

  private async moveBackToOriginalPosIfNoTarget(npc: INPC): Promise<void> {
    if (
      !npc.targetCharacter &&
      !this.reachedInitialPosition(npc) &&
      npc.pathOrientation === NPCPathOrientation.Backward
    ) {
      await this.moveTowardsPosition(npc, npc.initialX, npc.initialY);
    }
  }

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

  private async faceTarget(npc: INPC): Promise<void> {
    if (!npc.targetCharacter) {
      return;
    }

    const targetCharacter = (await this.characterRepository.findById(npc.targetCharacter.toString(), {
      leanType: "lean",
    })) as ICharacter;

    if (targetCharacter) {
      const facingDirection = this.npcTarget.getTargetDirection(npc, targetCharacter.x, targetCharacter.y);

      await NPC.updateOne({ _id: npc.id }, { direction: facingDirection });

      const nearbyCharacters = await this.npcView.getCharactersInView(npc);

      for (const nearbyCharacter of nearbyCharacters) {
        // check if update is needed (if character is not in the same scene, it's not needed)
        if (nearbyCharacter.scene !== npc.scene) {
          continue;
        }
        const clientNpc = await this.characterView.getElementOnView(nearbyCharacter, npc._id, "npcs");

        if (clientNpc?.direction === facingDirection) {
          return;
        }

        this.socketMessaging.sendEventToUser(nearbyCharacter.channelId!, NPCSocketEvents.NPCDataUpdate, {
          id: npc.id,
          direction: npc.direction,
          x: npc.x,
          y: npc.y,
        });
      }
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

  private async initBattleCycle(npc: INPC): Promise<void> {
    const hasBattleCycle = NPC_BATTLE_CYCLES.has(npc.id);

    if (!npc.targetCharacter) {
      // try to reset target, if somehow its lost
      await this.npcTarget.tryToSetTarget(npc);
    }

    if (!hasBattleCycle) {
      const npcSkills = (await Skill.findOne({
        _id: npc.skills,
      })
        .lean({ virtuals: true, defaults: true })
        .cacheQuery({
          cacheKey: `${npc.id}-skills`,
          ttl: 60 * 60 * 24 * 7,
        })) as ISkill;

      new NPCBattleCycle(
        npc.id,
        async () => {
          await this.newRelic.trackTransaction(NewRelicTransactionCategory.Operation, "NpcBattleCycle", async () => {
            const result = await Promise.all([
              NPC.findById(npc.id).lean({ virtuals: true, defaults: true }),
              Character.findById(npc.targetCharacter).lean({ virtuals: true, defaults: true }),
            ]);

            const targetCharacter = result[1] as ICharacter;

            const characterSkills = (await Skill.findOne({
              _id: targetCharacter.skills,
            })
              .lean()
              .cacheQuery({
                cacheKey: `${targetCharacter.id}-skills`,
              })) as ISkill;

            targetCharacter.skills = characterSkills;

            const updatedNPC = result[0] as INPC;

            updatedNPC.skills = npcSkills;

            const hasNoTarget = !updatedNPC.targetCharacter?.toString();
            const hasDifferentTarget = updatedNPC.targetCharacter?.toString() !== targetCharacter?.id;

            if (hasNoTarget || hasDifferentTarget) {
              if (hasBattleCycle) {
                await this.npcTarget.clearTarget(npc);
              }

              return;
            }

            const isInvisible = await this.specialEffect.isInvisible(targetCharacter);

            if (
              updatedNPC?.alignment === NPCAlignment.Hostile &&
              targetCharacter?.isAlive &&
              updatedNPC.isAlive &&
              !isInvisible
            ) {
              // if reached target and alignment is enemy, lets hit it
              await this.battleAttackTarget.checkRangeAndAttack(updatedNPC, targetCharacter);
              await this.tryToSwitchToRandomTarget(npc);
            }
          });
        },
        1500
      );
    }
  }

  private async tryToSwitchToRandomTarget(npc: INPC): Promise<boolean> {
    if (npc.canSwitchToLowHealthTarget || npc.canSwitchToRandomTarget) {
      // Odds have failed, we will not change target
      if (!this.checkOdds()) return false;

      const nearbyCharacters = await this.getVisibleCharactersInView(npc);
      // Only one character around this NPC, cannot change target
      if (nearbyCharacters.length <= 1) return false;
      let alreadySetted = false;

      if (npc.canSwitchToLowHealthTarget) {
        const charactersHealth: ICharacterHealth[] = [];
        for (const nearbyCharacter of nearbyCharacters) {
          if (!nearbyCharacter.isAlive) {
            continue;
          }

          charactersHealth.push({
            id: nearbyCharacter.id,
            health: nearbyCharacter.health,
          });
        }

        const minHealthCharacterInfo = _.minBy(charactersHealth, "health");

        if (!minHealthCharacterInfo) {
          return false;
        }

        const minHealthCharacter = (await this.characterRepository.findById(minHealthCharacterInfo?.id!, {
          leanType: "lean",
        })) as ICharacter;

        // Only set as target if the minimum health character is with 25% of it's health
        if (minHealthCharacter.health <= minHealthCharacter.maxHealth / 4) {
          await this.npcTarget.setTarget(npc, minHealthCharacter);
          npc.speed += npc.speed * 0.3;
          alreadySetted = true;
          return true;
        }
      }

      if (npc.canSwitchToRandomTarget && !alreadySetted) {
        const randomCharacter = _.sample(nearbyCharacters);
        if (randomCharacter) await this.npcTarget.setTarget(npc, randomCharacter);
        return true;
      }
    }

    return false;
  }

  private async moveTowardsPosition(npc: INPC, x: number, y: number): Promise<void> {
    try {
      const shortestPath = await this.npcMovement.getShortestPathNextPosition(
        npc,
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

  private checkOdds(): boolean {
    const random = Math.random();

    // Always have a 10% chance of returning true
    if (random < 0.1) return true;

    return false;
  }

  private async getVisibleCharactersInView(npc: INPC): Promise<ICharacter[]> {
    const chars = await this.npcView.getCharactersInView(npc);
    const visible: ICharacter[] = [];
    for (const c of chars) {
      if (!(await this.specialEffect.isInvisible(c))) {
        visible.push(c);
      }
    }
    return visible;
  }
}
