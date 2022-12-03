import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";
import { IEntityEffect } from "./data/blueprints/entityEffect";
import { EffectsSocketEvents } from "./EffectsSocketEvents";
import { EntityEffectCycle } from "./EntityEffectCycle";

@provide(EntityEffectUse)
export class EntityEffectUse {
  constructor(private effectsSocketEvents: EffectsSocketEvents, private animationEffect: AnimationEffect) {}

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
          await new EntityEffectCycle(
            () => {
              this.effectsSocketEvents.EntityEffect(attacker.id, entryEffect.key, {
                targetId: target.id,
                value: entryEffect.value,
                targetType: target.type,
              });
            },
            entryEffect.intervalMs,
            entryEffect.totalDurationMs
          );
          const ChaTarget = target as ICharacter;
          await this.animationEffect.sendAnimationEventToCharacter(
            ChaTarget,
            entryEffect.targetAnimationKey,
            target.id
          );
        }
      }
    }
  }
}
