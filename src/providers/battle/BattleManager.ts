import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleEventType, BattleSocketEvents, IBattleEventFromServer } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import { BattleDeath } from "./BattleDeathManager";
import { BattleEvent } from "./BattleEvent";

@provide(BattleManager)
export class BattleManager {
  constructor(
    private movementHelper: MovementHelper,
    private battleEvent: BattleEvent,
    private socketMessaging: SocketMessaging,
    private battleDeath: BattleDeath
  ) {}

  public async attackCharacter(npc: INPC, target: ICharacter): Promise<void> {
    switch (npc.attackType) {
      case EntityAttackType.Melee:
        // check if distance to target is under range (1 cell for melee)

        const isUnderRange = this.movementHelper.isUnderRange(npc.x, npc.y, target.x, target.y, 1);

        if (isUnderRange) {
          // calculate battle event...

          const battleEvent = this.battleEvent.calculateEvent(npc, target);

          let battleEventPayload: Partial<IBattleEventFromServer> = {
            targetId: target.id,
            targetType: "Character",
            eventType: battleEvent,
          };

          if (battleEvent === BattleEventType.Hit) {
            const damage = this.battleEvent.calculateHitDamage(npc, target);

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

              // check if character is dead after damage calculation. If so, send death event to client and characters around
              if (!target.isAlive) {
                await this.battleDeath.handleCharacterDeath(target);
              }
            } else {
              // if damage is 0, then the attack was blocked
              battleEventPayload.eventType = BattleEventType.Block;
            }
          }

          console.log(battleEventPayload);
          // send battleHitPayload to players around
          await this.socketMessaging.sendMessageToCloseCharacters(
            target,
            BattleSocketEvents.CharacterEvent,
            battleEventPayload
          );

          // send battleEvent payload to player as well

          this.socketMessaging.sendEventToUser(
            target.channelId!,
            BattleSocketEvents.CharacterEvent,
            battleEventPayload
          );
        }

        break;
      case EntityAttackType.None:
      default:
        // do nothing!
        break;
    }
  }
}
