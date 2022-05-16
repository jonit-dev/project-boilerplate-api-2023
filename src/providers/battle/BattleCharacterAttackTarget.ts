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

@provide(BattleCharacterAttackTarget)
export class BattleCharacterAttackTarget {
  constructor(
    private battleEvent: BattleEvent,
    private movementHelper: MovementHelper,
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private battleDeathManager: BattleDeathManager
  ) {}

  public async attackTarget(character: ICharacter, target: ICharacter | INPC): Promise<void> {
    try {
      const canAttack = this.canAttack(character, target);

      if (!canAttack) {
        return;
      }

      // check if target is under range
      switch (character?.attackType) {
        case EntityAttackType.Melee:
          const isUnderMeleeRange = this.movementHelper.isUnderRange(character.x, character.y, target.x, target.y, 1);

          if (isUnderMeleeRange) {
            await this.hitTarget(character, target, target.type);
          }

          break;
      }
    } catch (err) {
      console.error(err);
    }
  }

  private canAttack(character: ICharacter, target: ICharacter | INPC): boolean {
    if (!target.isAlive) {
      return false;
    }

    if (!character.isAlive) {
      return false;
    }

    return true;
  }

  private async hitTarget(character: ICharacter, target: ICharacter | INPC, targetType: string): Promise<void> {
    // calculate battle event...

    const battleEvent = this.battleEvent.calculateEvent(character, target);

    let battleEventPayload: Partial<IBattleEventFromServer> = {
      targetId: target.id,
      targetType: targetType as "Character" | "NPC",
      eventType: battleEvent,
    };

    if (battleEvent === BattleEventType.Hit) {
      const damage = this.battleEvent.calculateHitDamage(character, target);

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
          if (targetType === "Character") {
            await this.battleDeathManager.handleCharacterDeath(target as ICharacter);
          }
          if (targetType === "NPC") {
            this.battleDeathManager.handleNPCDeath(target as INPC);
          }
        }
      } else {
        // if damage is 0, then the attack was blocked
        battleEventPayload.eventType = BattleEventType.Block;
      }
    }

    // send battleHitPayload to characters around

    const nearbyCharacters = await this.characterView.getCharactersInView(character);

    for (const nearbyCharacter of nearbyCharacters) {
      this.socketMessaging.sendEventToUser(
        nearbyCharacter.channelId!,
        BattleSocketEvents.CharacterEvent,
        battleEventPayload
      );
    }

    // send battleEvent payload to player as well

    this.socketMessaging.sendEventToUser(character.channelId!, BattleSocketEvents.CharacterEvent, battleEventPayload);
  }
}
