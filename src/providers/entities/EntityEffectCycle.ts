import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { BattleRangedAttack } from "@providers/battle/BattleRangedAttack";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEntityEffect } from "./data/blueprints/entityEffect";

/* eslint-disable @typescript-eslint/no-floating-promises */
export class EntityEffectCycle {
  constructor(
    fn: Function,
    entryEffect: IEntityEffect,
    target: ICharacter | INPC,
    attacker: ICharacter | INPC,
    movementHelper: MovementHelper,
    battleRangedAttack: BattleRangedAttack
  ) {
    this.execute(
      fn,
      entryEffect.intervalMs,
      entryEffect.totalDurationMs,
      entryEffect.key,
      target,
      attacker,
      movementHelper,
      battleRangedAttack
    );
  }

  private async execute(
    fn: Function,
    iterations: number,
    totalDurationMs: number | undefined,
    key: string,
    target: ICharacter | INPC,
    attacker: ICharacter | INPC,
    movementHelper: MovementHelper,
    battleRangedAttack: BattleRangedAttack
  ): Promise<void> {
    await fn();
    let duration = totalDurationMs || iterations * 1000;

    // check target/attacker is alive
    const isAlive = checkLive(target, attacker);

    // TODO check target/attacker is in range
    const isInRange = await checkRange(target, attacker, movementHelper, battleRangedAttack);

    iterations--;
    duration -= 1000;
    if (iterations > 0 && duration > 0 && isAlive && isInRange) {
      const intervalDurationSec = 1;

      setTimeout(() => {
        this.execute(fn, iterations, totalDurationMs, key, target, attacker, movementHelper, battleRangedAttack);
      }, intervalDurationSec * 1000);
    } else {
      // remove entry key after the loop ends.
      const characterTarget = target as ICharacter;
      characterTarget.applyEntityEffect?.filter((e) => {
        return e !== key;
      });
    }
  }
}
function checkLive(target: ICharacter | INPC, attacker: ICharacter | INPC): boolean {
  if (!target.isAlive) return false;
  if (!attacker.isAlive) return false;
  return true;
}
async function checkRange(
  target: ICharacter | INPC,
  attacker: ICharacter | INPC,
  movementHelper: MovementHelper,
  battleRangedAttack: BattleRangedAttack
): Promise<boolean> {
  switch (attacker.attackType) {
    case EntityAttackType.MeleeRanged:
      const isUnderMeleeRange = movementHelper.isUnderRange(attacker.x, attacker.y, target.x, target.y, 1);
      if (isUnderMeleeRange) return true;
      const rangedMeleeAttackParams = await battleRangedAttack.validateAttack(attacker, target);
      if (rangedMeleeAttackParams) return true;
      break;
    case EntityAttackType.Melee:
      const isUnderMelee = movementHelper.isUnderRange(attacker.x, attacker.y, target.x, target.y, 1);
      if (isUnderMelee) return true;
      break;
    case EntityAttackType.Ranged:
      const rangedAttackParams = await battleRangedAttack.validateAttack(attacker, target);
      if (rangedAttackParams) return true;
      break;
    default:
      break;
  }
  return false;
}
