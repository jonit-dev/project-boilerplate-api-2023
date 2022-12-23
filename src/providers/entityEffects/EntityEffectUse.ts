import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";
import { EntityEffectCycle } from "./EntityEffectCycle";
import { IEntityEffect } from "./data/blueprints/entityEffect";
import { entityEffectsBlueprintsIndex } from "./data/index";

@provide(EntityEffectUse)
export class EntityEffectUse {
  constructor() {}

  public async applyEntityEffects(target: ICharacter | INPC, attacker: INPC): Promise<void> {
    const entityEffects = this.getApplicableEntityEffects(attacker);
    if (entityEffects.length < 1) {
      return;
    }

    for (const entityEffect of entityEffects) {
      await this.applyEntityEffect(entityEffect, target, attacker);
    }
  }

  private getApplicableEntityEffects(npc: INPC): IEntityEffect[] {
    const npcEffects = npc.entityEffects ?? [];
    const applicableEffects: IEntityEffect[] = [];

    npcEffects.forEach((effect) => {
      const entityEffect: IEntityEffect = entityEffectsBlueprintsIndex[effect];

      if (npc.attackType === EntityAttackType.MeleeRanged || npc.attackType === entityEffect.type) {
        applicableEffects.push(entityEffect);
      }
    });

    return applicableEffects;
  }

  private async applyEntityEffect(
    entityEffect: IEntityEffect,
    target: ICharacter | INPC,
    attacker: INPC
  ): Promise<void> {
    const n = random(1, 100);
    if (n > entityEffect.probability) {
      return;
    }

    let appliedEffects = target.appliedEntityEffects ?? [];
    const applied = appliedEffects.find((effect) => effect.key === entityEffect.key);

    if (applied) {
      const applicationStopped = new Date().getTime() - applied.lastUpdated > entityEffect.intervalMs * 2;
      if (!applicationStopped) {
        return;
      } else {
        appliedEffects = appliedEffects.filter((e) => e.key !== entityEffect.key);
      }
    }

    appliedEffects.push({ key: entityEffect.key, lastUpdated: new Date().getTime() });
    target.appliedEntityEffects = appliedEffects;
    await target.save();

    new EntityEffectCycle(entityEffect, target._id, target.type, attacker._id);
  }
}
