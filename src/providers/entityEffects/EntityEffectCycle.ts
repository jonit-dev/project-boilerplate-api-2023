import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { TimerWrapper } from "@providers/helpers/TimerWrapper";
import { container, newRelic, npcExperience } from "@providers/inversify/container";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { AnimationEffectKeys, CharacterSocketEvents, EntityType, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { IEntityEffect } from "./data/blueprints/entityEffect";

/* eslint-disable @typescript-eslint/no-floating-promises */

export class EntityEffectCycle {
  constructor(
    entityEffect: IEntityEffect,
    targetId: string,
    targetType: string,
    attackerId: string,
    attackerType: string
  ) {
    this.execute(entityEffect, entityEffect.totalDurationMs ?? -1, targetId, targetType, attackerId, attackerType);
  }

  private async execute(
    entityEffect: IEntityEffect,
    remainingDurationMs: number,
    targetId: string,
    targetType: string,
    attackerId: string,
    attackerType: string
  ): Promise<void> {
    await newRelic.trackTransaction(NewRelicTransactionCategory.Operation, "EntityEffectCycle.execute", async () => {
      const target = await this.getTarget(targetId, targetType);

      if (!target) {
        return;
      }

      const appliedEffects = target.appliedEntityEffects ?? [];
      const currentEffectIndex = appliedEffects.findIndex((effect) => effect.key === entityEffect.key);
      if (currentEffectIndex < 0) {
        return;
      }

      const attacker = await this.getTarget(attackerId, attackerType, true);
      const damage = await entityEffect.effect(target, attacker as ICharacter | INPC);

      if (target.type === EntityType.NPC && attacker) {
        await npcExperience.recordXPinBattle(attacker as ICharacter, target, damage);
      }

      const runAgain = remainingDurationMs === -1 || remainingDurationMs >= entityEffect.intervalMs;
      if (!runAgain) {
        target.appliedEntityEffects = target.appliedEntityEffects!.filter((e) => e.key !== entityEffect.key);
      } else {
        target.appliedEntityEffects![currentEffectIndex].lastUpdated = new Date().getTime();
        target.markModified("appliedEntityEffects");
      }

      const isAlive = await this.applyCharacterChanges(target, entityEffect, damage);

      if (!isAlive) {
        await this.handleDeath(target);
      }

      if (!runAgain || !isAlive) {
        return;
      }

      remainingDurationMs = remainingDurationMs === -1 ? -1 : remainingDurationMs - entityEffect.intervalMs;

      const timer = container.get(TimerWrapper);
      timer.setTimeout(() => {
        this.execute(entityEffect, remainingDurationMs, targetId, targetType, attackerId, attackerType);
      }, entityEffect.intervalMs);
    });
  }

  private async getTarget(targetId: string, targetType: string, attacker?: boolean): Promise<ICharacter | INPC | null> {
    let target: ICharacter | INPC | null = null;
    if (targetType === EntityType.NPC) {
      target = (await NPC.findOne({ _id: targetId }).populate("skills")) as unknown as INPC;
    } else if (targetType === EntityType.Character) {
      if (attacker) {
        // TODO: Refactor to repository
        target = (await Character.findOne({ _id: targetId }).populate("skills")) as unknown as ICharacter;
      } else {
        target = (await Character.findOne({ _id: targetId })) as ICharacter;
      }
    }

    return target;
  }

  private async applyCharacterChanges(
    target: ICharacter | INPC,
    entityEffect: IEntityEffect,
    effectDamage: number
  ): Promise<boolean> {
    if (!target.isAlive) {
      await this.handleDeath(target);
      return false;
    }

    if (target.type === "Character") {
      await Character.updateOne(
        { _id: target.id },
        { $set: { appliedEntityEffects: target.appliedEntityEffects, health: target.health } }
      );
    }
    if (target.type === "NPC") {
      await NPC.updateOne(
        { _id: target.id },
        { $set: { appliedEntityEffects: target.appliedEntityEffects, health: target.health } }
      );
    }

    this.sendAnimationEvent(target, entityEffect.targetAnimationKey);
    this.sendAttributeChangedEvent(target);

    return true;
  }

  private sendAnimationEvent(target: ICharacter | INPC, effectKey: string): void {
    const animationEffect = container.get(AnimationEffect);

    if (target.type === EntityType.Character) {
      animationEffect.sendAnimationEventToCharacter(target as ICharacter, effectKey as AnimationEffectKeys);
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
      await socketMessaging.sendEventToCharactersAroundNPC(
        target as INPC,
        CharacterSocketEvents.AttributeChanged,
        payload
      );
    }
  }

  private async handleDeath(target: ICharacter | INPC): Promise<void> {
    if (target.type === EntityType.Character) {
      const characterDeath = container.get(CharacterDeath);
      await characterDeath.handleCharacterDeath(null, target as ICharacter);
    } else {
      const npcDeath = container.get(NPCDeath);
      await npcDeath.handleNPCDeath(target as INPC);
    }
  }
}
