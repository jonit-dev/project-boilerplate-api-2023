import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { BattleAttackTarget } from "@providers/battle/BattleAttackTarget";
import { MovementHelper } from "@providers/movement/MovementHelper";
import {
  FromGridX,
  FromGridY,
  NPCAlignment,
  NPCMovementType,
  NPCPathOrientation,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCBattleCycle } from "../NPCBattleCycle";
import { NPCMovement } from "./NPCMovement";
import { NPCTarget } from "./NPCTarget";

@provide(NPCMovementMoveTowards)
export class NPCMovementMoveTowards {
  constructor(
    private movementHelper: MovementHelper,
    private npcMovement: NPCMovement,
    private npcTarget: NPCTarget,
    private battleAttackTarget: BattleAttackTarget
  ) {}

  public async startMoveTowardsMovement(npc: INPC): Promise<void> {
    // first step is setting a target
    // for this, get all characters nearby and set the target to the closest one

    const targetCharacter = await Character.findById(npc.targetCharacter).populate("skills");

    if (targetCharacter) {
      await this.npcTarget.tryToClearOutOfRangeTargets(npc);

      const reachedTarget = this.reachedTarget(npc, targetCharacter);
      if (npc.alignment === NPCAlignment.Hostile) {
        this.initBattleCycle(npc);
      }

      // change movement to MoveWay (flee) if health is low!

      if (npc.fleeOnLowHealth) {
        if (npc.health <= npc.maxHealth / 4) {
          npc.currentMovementType = NPCMovementType.MoveAway;
          await npc.save();
        }
      }

      if (reachedTarget) {
        if (npc.pathOrientation === NPCPathOrientation.Backward) {
          // if NPC is coming back from being lured, reset its orientation to Forward
          npc.pathOrientation = NPCPathOrientation.Forward;
          await npc.save();
        }

        return;
      }

      try {
        // calculate distance to original position
        if (!npc.maxRangeInGridCells) {
          throw new Error(`NPC ${npc.id} has no maxRangeInGridCells set!`);
        }

        switch (npc.pathOrientation) {
          case NPCPathOrientation.Forward:
            const isUnderOriginalPositionRange = this.movementHelper.isUnderRange(
              npc.x,
              npc.y,
              npc.initialX,
              npc.initialY,
              npc.maxRangeInGridCells
            );

            if (isUnderOriginalPositionRange) {
              await this.moveTowardsPosition(npc, targetCharacter.x, targetCharacter.y);
            } else {
              npc.pathOrientation = NPCPathOrientation.Backward;
              await npc.save();
            }
            break;
          case NPCPathOrientation.Backward:
            await this.moveTowardsPosition(npc, npc.initialX, npc.initialY);

            break;
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // no target character
      await this.npcTarget.tryToSetTarget(npc);

      // if not target is set and we're out of X and Y position, just move back
      if (
        !npc.targetCharacter &&
        !this.reachedInitialPosition(npc) &&
        npc.pathOrientation === NPCPathOrientation.Backward
      ) {
        await this.moveTowardsPosition(npc, npc.initialX, npc.initialY);
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

  private initBattleCycle(npc: INPC): void {
    const hasBattleCycle = NPCBattleCycle.npcBattleCycles.has(npc.id);

    if (!hasBattleCycle) {
      new NPCBattleCycle(
        npc.id,
        async () => {
          if (!npc.targetCharacter) {
            // try to reset target, if somehow its lost
            await this.npcTarget.tryToSetTarget(npc);
          }

          const targetCharacter = (await Character.findById(npc.targetCharacter).populate("skills")) as ICharacter;
          const facingDirection = this.npcTarget.getTargetDirection(npc, targetCharacter.x, targetCharacter.y);

          npc.direction = facingDirection;
          await npc.save();

          const updatedNPC = (await NPC.findById(npc.id).populate("skills")) as INPC;

          if (updatedNPC?.alignment === NPCAlignment.Hostile && targetCharacter?.isAlive && updatedNPC.isAlive) {
            // if reached target and alignment is enemy, lets hit it
            await this.battleAttackTarget.checkRangeAndAttack(updatedNPC, targetCharacter);
          }
        },
        1000
      );
    }
  }

  private async moveTowardsPosition(npc: INPC, x: number, y: number): Promise<void> {
    try {
      const shortestPath = this.npcMovement.getShortestPathNextPosition(
        npc,
        ToGridX(npc.x),
        ToGridY(npc.y),
        ToGridX(x),
        ToGridY(y)
      );

      if (!shortestPath) {
        // throw new Error("No shortest path found!");
        return;
      }

      const { newGridX, newGridY, nextMovementDirection } = shortestPath;

      if (newGridX && newGridY && nextMovementDirection) {
        await this.npcMovement.moveNPC(
          npc,
          npc.x,
          npc.y,
          FromGridX(newGridX),
          FromGridY(newGridY),
          nextMovementDirection
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
