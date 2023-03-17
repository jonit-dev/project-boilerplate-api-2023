import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { UISocketEvents } from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { EntityEffectCycle } from "./EntityEffectCycle";
import { IEntityEffect } from "./data/blueprints/entityEffect";
import { entityEffectsBlueprintsIndex } from "./data/index";
import { EntityEffectBlueprint } from "./data/types/entityEffectBlueprintTypes";

@provide(EntityEffectUse)
export class EntityEffectUse {
  constructor(private socketMessaging: SocketMessaging) {}

  public async applyEntityEffects(target: ICharacter | INPC, attacker: INPC): Promise<void> {
    const entityEffects = this.getApplicableEntityEffects(attacker);
    if (entityEffects.length < 1) {
      return;
    }

    for (const entityEffect of entityEffects) {
      await this.applyEntityEffect(entityEffect, target, attacker);
    }
  }

  public async clearEntityEffect(effectKey: EntityEffectBlueprint, target: ICharacter | INPC): Promise<void> {
    if (!target.appliedEntityEffects) {
      return;
    }

    const hasEntityEffect = target.appliedEntityEffects.some((effect) => effect.key === effectKey);

    if (!hasEntityEffect) {
      return;
    }

    target.appliedEntityEffects = target.appliedEntityEffects.filter((effect) => effect.key !== effectKey);

    if (target.type === EntityType.Character) {
      const character = target as ICharacter;
      await Character.updateOne(
        { _id: character._id },
        { $set: { appliedEntityEffects: character.appliedEntityEffects } }
      );

      this.socketMessaging.sendEventToUser(character.channelId!, UISocketEvents.ShowMessage, {
        message: `The following effect was cured: ${effectKey.toLowerCase()}.`,
      });
      return;
    }

    if (target.type === EntityType.NPC) {
      await NPC.updateOne({ _id: target._id }, { $set: { appliedEntityEffects: target.appliedEntityEffects } });
    }
  }

  public async clearAllEntityEffects(target: ICharacter | INPC): Promise<void> {
    switch (target.type) {
      case EntityType.Character:
        await Character.updateOne({ _id: target._id }, { $unset: { appliedEntityEffects: 1 } });

        break;
      case EntityType.NPC:
        await NPC.updateOne({ _id: target._id }, { $unset: { appliedEntityEffects: 1 } });
        break;
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
    const n = _.random(0, 100);

    if (entityEffect.probability <= n) {
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

    this.startEntityEffectCycle(entityEffect, target, attacker);
  }

  private startEntityEffectCycle(entityEffect: IEntityEffect, target: ICharacter | INPC, attacker: INPC): void {
    new EntityEffectCycle(entityEffect, target._id, target.type, attacker._id);
  }
}
