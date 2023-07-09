import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { NPCTarget } from "@providers/npc/movement/NPCTarget";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";

import { TrackClassExecutionTime } from "@providers/analytics/decorator/TrackClassExecutionTime";
import {
  BattleSocketEvents,
  GRID_WIDTH,
  IBattleCancelTargeting,
  ItemSubType,
  SOCKET_TRANSMISSION_ZONE_WIDTH,
} from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import { HitTarget } from "../HitTarget";
import { BattleNetworkStopTargeting } from "../network/BattleNetworkStopTargetting";
import { BattleAttackRanged } from "./BattleAttackRanged";
import { BattleAttackValidator } from "./BattleAttackValidator";

@TrackClassExecutionTime()
@provide(BattleAttackTarget)
export class BattleAttackTarget {
  constructor(
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting,
    private npcTarget: NPCTarget,
    private characterDeath: CharacterDeath, //! dont remove this
    private battleRangedAttack: BattleAttackRanged,
    private characterWeapon: CharacterWeapon,
    private battleAttackValidator: BattleAttackValidator,
    private hitTarget: HitTarget
  ) {}

  public async checkRangeAndAttack(attacker: ICharacter | INPC, target: ICharacter | INPC): Promise<boolean> {
    if (!target.isAlive) {
      return false;
    }

    const attackerType = attacker.attackType || (await this.characterWeapon.getAttackType(attacker as ICharacter));

    switch (attackerType) {
      case EntityAttackType.Melee: {
        const isUnderMeleeRange = this.movementHelper.isUnderRange(attacker.x, attacker.y, target.x, target.y, 2);

        if (isUnderMeleeRange) {
          await this.hitTarget.hit(attacker, target);
          return true;
        }
        break;
      }

      case EntityAttackType.Ranged: {
        const rangedAttackParams = await this.battleAttackValidator.validateAttack(attacker, target);

        if (rangedAttackParams) {
          if (attacker.type === "Character") {
            const character = attacker as ICharacter;
            if (rangedAttackParams.itemSubType === ItemSubType.Magic) {
              return this.performRangedAttack(attacker, target, rangedAttackParams);
            } else if (rangedAttackParams.itemSubType === ItemSubType.Staff) {
              const attack = await this.battleAttackValidator.validateMagicAttack(character._id, {
                targetId: target.id,
                targetType: target.type as EntityType,
              });

              if (attack) {
                return this.performRangedAttack(attacker, target, rangedAttackParams, true);
              }
              return attack;
            } else if (rangedAttackParams.itemSubType === ItemSubType.Ranged) {
              return this.performRangedAttack(attacker, target, rangedAttackParams);
            }
          } else {
            return this.performRangedAttack(attacker, target, rangedAttackParams);
          }
        }
        break;
      }

      case EntityAttackType.MeleeRanged: {
        if (attacker.type === "Character") {
          throw new Error(`Character cannot have MeleeRanged hybrid attack type. Character id ${attacker.id}`);
        }

        const isUnderMeleeRange = this.movementHelper.isUnderRange(attacker.x, attacker.y, target.x, target.y, 1);

        if (isUnderMeleeRange) {
          await this.hitTarget.hit(attacker, target);
          return true;
        } else {
          const rangedAttackParams = await this.battleAttackValidator.validateAttack(attacker, target);

          if (rangedAttackParams) {
            return this.performRangedAttack(attacker, target, rangedAttackParams);
          }
        }
        break;
      }

      default: {
        return false;
      }
    }

    const isTargetClose = this.movementHelper.isUnderRange(
      attacker.x,
      attacker.y,
      target.x,
      target.y,
      (SOCKET_TRANSMISSION_ZONE_WIDTH * 2) / GRID_WIDTH / 2
    );

    if (!isTargetClose) {
      if (attacker.type === "Character") {
        const character = attacker as ICharacter;
        await this.battleNetworkStopTargeting.stopTargeting(character);

        this.socketMessaging.sendEventToUser<IBattleCancelTargeting>(
          character.channelId!,
          BattleSocketEvents.CancelTargeting,
          {
            targetId: target.id,
            type: target.type as EntityType,
            reason: "Your battle target was lost.",
          }
        );
      }

      if (attacker.type === "NPC") {
        const npc = attacker as INPC;
        await this.npcTarget.tryToClearOutOfRangeTargets(npc);
      }

      return false;
    }

    return true;
  }

  private async performRangedAttack(
    attacker: ICharacter | INPC,
    target: ICharacter | INPC,
    rangedAttackParams: any,
    magicAttack = false
  ): Promise<boolean> {
    await this.hitTarget.hit(attacker, target, magicAttack);
    await this.battleRangedAttack.sendRangedAttackEvent(attacker, target, rangedAttackParams);
    if (attacker.type === "Character" && rangedAttackParams.itemSubType === ItemSubType.Ranged) {
      await this.battleRangedAttack.consumeAmmo(rangedAttackParams, attacker as ICharacter);
    }
    return true;
  }
}
