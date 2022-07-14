import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { CharacterView } from "@providers/character/CharacterView";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { NPCTarget } from "@providers/npc/movement/NPCTarget";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  BattleEventType,
  BattleSocketEvents,
  GRID_WIDTH,
  IBattleCancelTargeting,
  IBattleEventFromServer,
  SOCKET_TRANSMISSION_ZONE_WIDTH,
} from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { BattleEffects } from "./BattleEffects";
import { BattleEvent } from "./BattleEvent";
import { BattleNetworkStopTargeting } from "./network/BattleNetworkStopTargetting";

@provide(BattleAttackTarget)
export class BattleAttackTarget {
  constructor(
    private battleEvent: BattleEvent,
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private movementHelper: MovementHelper,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting,
    private npcTarget: NPCTarget,
    private battleEffects: BattleEffects,
    private characterDeath: CharacterDeath,
    private npcDeath: NPCDeath,
    private skillIncrease: SkillIncrease
  ) {}

  public async checkRangeAndAttack(attacker: ICharacter | INPC, target: ICharacter | INPC): Promise<void> {
    switch (attacker?.attackType) {
      case EntityAttackType.Melee:
        const isUnderMeleeRange = this.movementHelper.isUnderRange(attacker.x, attacker.y, target.x, target.y, 1);

        if (isUnderMeleeRange) {
          await this.hitTarget(attacker, target);
        }

        break;
    }

    const isTargetClose = this.movementHelper.isUnderRange(
      attacker.x,
      attacker.y,
      target.x,
      target.y,
      SOCKET_TRANSMISSION_ZONE_WIDTH / GRID_WIDTH / 2
    );

    if (!isTargetClose) {
      if (attacker.type === "Character") {
        const character = attacker as ICharacter;
        this.battleNetworkStopTargeting.stopTargeting(character);
        this.socketMessaging.sendEventToUser<IBattleCancelTargeting>(
          character.channelId!,
          BattleSocketEvents.CancelTargeting,
          {
            targetId: target.id,
            type: target.type as EntityType,
            reason: "Battle target cancelled because target is too distant",
          }
        );
      }

      if (attacker.type === "NPC") {
        const npc = attacker as INPC;
        await this.npcTarget.tryToClearOutOfRangeTargets(npc);
      }
    }
  }

  private async hitTarget(attacker: ICharacter | INPC, target: ICharacter | INPC): Promise<void> {
    const battleEvent = await this.battleEvent.calculateEvent(attacker, target);

    let battleEventPayload: Partial<IBattleEventFromServer> = {
      targetId: target.id,
      targetType: target.type as "Character" | "NPC",
      eventType: battleEvent,
    };

    if (battleEvent === BattleEventType.Hit) {
      const damage = await this.battleEvent.calculateHitDamage(attacker, target);

      if (damage > 0) {
        // Increase attacker SP for weapon used and XP (if is character)
        if (attacker.type === "Character") {
          const character = attacker as ICharacter;
          await this.skillIncrease.increaseSkillsOnBattle(character, target, damage);
        }

        // Update target health
        const newTargetHealth = target.health - damage;

        if (newTargetHealth <= 0) {
          target.health = 0;
        } else {
          target.health -= damage;
        }
        await target.save();

        const n = _.random(0, 100);

        if (n <= 30) {
          await this.battleEffects.generateBloodOnGround(target);
        }

        battleEventPayload = {
          ...battleEventPayload,
          totalDamage: damage,
          postDamageTargetHP: target.health,
        };

        // check if character is dead after damage calculation. If so, send death event to client and characters around
        if (!target.isAlive) {
          if (target.type === "Character") {
            await this.battleEffects.generateBloodOnGround(target);

            await this.characterDeath.handleCharacterDeath(target as ICharacter);
            await this.npcTarget.clearTarget(attacker as INPC);
            await this.npcTarget.tryToSetTarget(attacker as INPC);
          }
          if (target.type === "NPC") {
            await this.battleEffects.generateBloodOnGround(target);
            await this.npcDeath.handleNPCDeath(target as INPC, attacker as ICharacter);
            await this.skillIncrease.releaseXP(target as INPC);

            // clear attacker target
            if (attacker instanceof Character) {
              await this.battleNetworkStopTargeting.stopTargeting(attacker as ICharacter);
            }
          }
        }
      } else {
        // if damage is 0, then the attack was blocked
        battleEventPayload.eventType = BattleEventType.Block;

        // Increase shielding SP in target (if is Character)
        if (target.type === "Character") {
          const character = target as ICharacter;
          await this.skillIncrease.increaseShieldingSP(character);
        }
      }
    }

    // finally, send battleHitPayload to characters around

    const nearbyCharacters = await this.characterView.getCharactersInView(attacker as ICharacter);

    for (const nearbyCharacter of nearbyCharacters) {
      this.socketMessaging.sendEventToUser(
        nearbyCharacter.channelId!,
        BattleSocketEvents.BattleEvent,
        battleEventPayload
      );
    }

    // send battleEvent payload to origin character as well

    const entity = attacker as ICharacter;

    if (entity.channelId) {
      this.socketMessaging.sendEventToUser(entity.channelId, BattleSocketEvents.BattleEvent, battleEventPayload);
    }
  }
}
