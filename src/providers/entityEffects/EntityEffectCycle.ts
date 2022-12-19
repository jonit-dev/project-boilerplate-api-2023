import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { IEntityEffect } from "./data/blueprints/entityEffect";
import { container } from "@providers/inversify/container";
import { TimerWrapper } from "@providers/helpers/TimerWrapper";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { EffectsSocketEvents, EntityType, IEntityEffectEvent } from "@rpg-engine/shared/dist/types/entity.types";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { NPCDeath } from "@providers/npc/NPCDeath";

/* eslint-disable @typescript-eslint/no-floating-promises */
export class EntityEffectCycle {
  constructor(entityEffect: IEntityEffect, targetId: string, targetType: string, attackerNpcId: string) {
    this.execute(entityEffect, entityEffect.totalDurationMs ?? -1, targetId, targetType, attackerNpcId);
  }

  private async execute(
    entityEffect: IEntityEffect,
    remainingDurationMs: number,
    targetId: string,
    targetType: string,
    attackerNpcId: string
  ): Promise<void> {
    const target = await this.getTarget(targetId, targetType);

    if (!target || !target.isAlive) {
      return;
    }

    const appliedEffects = target.appliedEntityEffects ?? [];
    const currentEffectIndex = appliedEffects.findIndex((effect) => effect.key === entityEffect.key);
    if (currentEffectIndex < 0) {
      return;
    }

    const attacker = await this.getTarget(attackerNpcId, EntityType.NPC);

    const damage = await entityEffect.effect(target, attacker as INPC);

    const runAgain = remainingDurationMs === -1 || remainingDurationMs >= entityEffect.intervalMs;
    if (!runAgain) {
      target.appliedEntityEffects = target.appliedEntityEffects!.filter((e) => e.key !== entityEffect.key);
    } else {
      target.appliedEntityEffects![currentEffectIndex].lastUpdated = new Date().getTime();
      target.markModified("appliedEntityEffects");
    }

    const isAlive = await this.applyCharacterChanges(target, entityEffect, damage);

    if (!runAgain || !isAlive) {
      return;
    }

    remainingDurationMs = remainingDurationMs === -1 ? -1 : remainingDurationMs - entityEffect.intervalMs;

    const timer = container.get(TimerWrapper);
    timer.setTimeout(() => {
      this.execute(entityEffect, remainingDurationMs, targetId, targetType, attackerNpcId);
    }, entityEffect.intervalMs);
  }

  private async getTarget(targetId: string, targetType: string): Promise<ICharacter | INPC | null> {
    let target: ICharacter | INPC | null = null;
    if (targetType === EntityType.NPC) {
      target = (await NPC.findOne({ _id: targetId }).populate("skills")) as unknown as INPC;
    } else if (targetType === EntityType.Character) {
      target = (await Character.findOne({ _id: targetId })) as ICharacter;
    }

    return target;
  }

  private async applyCharacterChanges(
    target: ICharacter | INPC,
    entityEffect: IEntityEffect,
    effectDamage: number
  ): Promise<boolean> {
    await target.save();

    this.sendAnimationEvent(target, entityEffect.targetAnimationKey);
    this.sendAttributeChangedEvent(target);
    this.sendEffectsEvent(target, effectDamage);

    if (!target.isAlive) {
      await this.handleDeath(target);
      return false;
    }
    return true;
  }

  private sendAnimationEvent(target: ICharacter | INPC, effectKey: string): void {
    const animationEffect = container.get(AnimationEffect);

    if (target.type === EntityType.Character) {
      animationEffect.sendAnimationEventToCharacter(target as ICharacter, effectKey);
    } else {
      animationEffect.sendAnimationEventToNPC(target as INPC, effectKey);
    }
  }

  private async sendAttributeChangedEvent(target: ICharacter | INPC): Promise<void> {
    const socketMessaging = container.get(SocketMessaging);

    const payload: ICharacterAttributeChanged = {
      targetId: target._id,
      health: target.health,
      mana: target.mana,
      speed: target.speed,
    };

    if (target.type === EntityType.Character) {
      const character = target as ICharacter;

      socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, payload);
      await socketMessaging.sendEventToCharactersAroundCharacter(
        character,
        CharacterSocketEvents.AttributeChanged,
        payload
      );
    } else {
      socketMessaging.sendEventToCharactersAroundNPC(target as INPC, CharacterSocketEvents.AttributeChanged, payload);
    }
  }

  private async sendEffectsEvent(target: ICharacter | INPC, damage: number): Promise<void> {
    const socketMessaging = container.get(SocketMessaging);

    const payload: IEntityEffectEvent = {
      targetId: target._id,
      targetType: target.type as EntityType,
      value: damage,
    };

    if (target.type === EntityType.Character) {
      const character = target as ICharacter;

      socketMessaging.sendEventToUser(character.channelId!, EffectsSocketEvents.EntityEffect, payload);
      await socketMessaging.sendEventToCharactersAroundCharacter(character, EffectsSocketEvents.EntityEffect, payload);
    } else {
      socketMessaging.sendEventToCharactersAroundNPC(target as INPC, EffectsSocketEvents.EntityEffect, payload);
    }
  }

  private async handleDeath(target: ICharacter | INPC): Promise<void> {
    if (target.type === EntityType.Character) {
      const characterDeath = container.get(CharacterDeath);
      await characterDeath.handleCharacterDeath(null, target as ICharacter);
    } else {
      const npcDeath = container.get(NPCDeath);
      await npcDeath.handleNPCDeath(target as INPC, null);
    }
  }
}