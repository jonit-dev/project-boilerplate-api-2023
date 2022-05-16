import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleEventType, BattleSocketEvents, IBattleEventFromServer } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import { BattleDeathManager } from "./BattleDeathManager";
import { BattleEvent } from "./BattleEvent";

@provide(BattleAttackTarget)
export class BattleAttackTarget {
  constructor(
    private battleEvent: BattleEvent,
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private battleDeathManager: BattleDeathManager,
    private movementHelper: MovementHelper
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
  }

  private async hitTarget(attacker: ICharacter | INPC, target: ICharacter | INPC): Promise<void> {
    const battleEvent = this.battleEvent.calculateEvent(attacker, target);

    let battleEventPayload: Partial<IBattleEventFromServer> = {
      targetId: target.id,
      targetType: target.type as "Character" | "NPC",
      eventType: battleEvent,
    };

    if (battleEvent === BattleEventType.Hit) {
      const damage = this.battleEvent.calculateHitDamage(attacker, target);

      if (damage > 0) {
        const newTargetHealth = target.health - damage;

        if (newTargetHealth <= 0) {
          target.health = 0;
        } else {
          target.health -= damage;
        }
        await target.save();

        battleEventPayload = {
          ...battleEventPayload,
          totalDamage: damage,
          postDamageTargetHP: target.health,
        };

        console.log(battleEventPayload);

        // check if character is dead after damage calculation. If so, send death event to client and characters around
        if (!target.isAlive) {
          if (target.type === "Character") {
            await this.battleDeathManager.handleCharacterDeath(target as ICharacter);
          }
          if (target.type === "NPC") {
            this.battleDeathManager.handleNPCDeath(target as INPC);
          }
        }
      } else {
        // if damage is 0, then the attack was blocked
        battleEventPayload.eventType = BattleEventType.Block;
      }
    }

    // finally, send battleHitPayload to characters around

    const nearbyCharacters = await this.characterView.getCharactersInView(attacker as ICharacter);

    for (const nearbyCharacter of nearbyCharacters) {
      this.socketMessaging.sendEventToUser(
        nearbyCharacter.channelId!,
        BattleSocketEvents.CharacterEvent,
        battleEventPayload
      );
    }

    // send battleEvent payload to origin character as well

    const entity = attacker as ICharacter;

    if (entity.channelId) {
      this.socketMessaging.sendEventToUser(entity.channelId, BattleSocketEvents.CharacterEvent, battleEventPayload);
    }
  }
}
