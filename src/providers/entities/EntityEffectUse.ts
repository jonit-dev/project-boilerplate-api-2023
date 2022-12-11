import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { BattleRangedAttack } from "@providers/battle/BattleRangedAttack";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { BattleEventType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";
import { IEntityEffect } from "./data/blueprints/entityEffect";
import { EffectsSocketEvents } from "./EffectsSocketEvents";
import { EntityEffectCycle } from "./EntityEffectCycle";

@provide(EntityEffectUse)
export class EntityEffectUse {
  constructor(
    private effectsSocketEvents: EffectsSocketEvents,
    private movementHelper: MovementHelper,
    private battleRangedAttack: BattleRangedAttack
  ) {}

  public async applyEntityEffects(
    entryEffects: IEntityEffect[],
    target: ICharacter | INPC,
    attacker: ICharacter | INPC
  ): Promise<void> {
    if (entryEffects?.length) {
      for (let index = 0; index < entryEffects.length; index++) {
        const entryEffect = entryEffects[index];
        // check for probability of success
        const n = random(0, 100);
        if (n < entryEffect.probability) {
          // only Characters can have channel Id. so converting target as character
          const characterTarget = target as ICharacter;

          // if channel id undefine set id as channel id.
          let targetChannelId: string;
          characterTarget.channelId
            ? (targetChannelId = characterTarget.channelId)
            : (targetChannelId = characterTarget.id);

          if (!characterTarget.applyEntityEffect?.find((e) => e === entryEffect.key)) {
            if (characterTarget.applyEntityEffect === undefined) characterTarget.applyEntityEffect = [];
            characterTarget.applyEntityEffect.push(entryEffect.key);
            await new EntityEffectCycle(
              async () => {
                await this.effectsSocketEvents.EntityEffect(
                  targetChannelId,
                  {
                    targetId: target.id,
                    targetType: target.type as "Character" | "NPC",
                    eventType: entryEffect.key as BattleEventType,
                    totalDamage: entryEffect.value,
                  },
                  target,
                  entryEffect
                );
              },
              entryEffect,
              target,
              attacker,
              this.movementHelper,
              this.battleRangedAttack
            );
          }
        }
      }
    }
  }
}
