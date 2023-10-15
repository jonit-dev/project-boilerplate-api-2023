import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { TimerWrapper } from "@providers/helpers/TimerWrapper";
import { container, locker } from "@providers/inversify/container";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { NPCExperience } from "@providers/npc/NPCExperience/NPCExperience";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { AnimationEffectKeys, CharacterSocketEvents, EntityType, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { IEntityEffect } from "./data/blueprints/entityEffect";

/* eslint-disable @typescript-eslint/no-floating-promises */

type IEntity = ICharacter | INPC;
@provide(EntityEffectCycle)
export class EntityEffectCycle {
  constructor(
    private newRelic: NewRelic,
    private characterValidation: CharacterValidation,
    private npcExperience: NPCExperience,
    private socketMessaging: SocketMessaging,
    private animationEffect: AnimationEffect,
    private characterDeath: CharacterDeath,
    private npcDeath: NPCDeath
  ) {}

  public async start(
    entityEffect: IEntityEffect,
    targetId: string,
    targetType: string,
    attackerId: string,
    attackerType: string
  ): Promise<void> {
    await this.execute(
      entityEffect,
      entityEffect.totalDurationMs ?? -1,
      targetId,
      targetType,
      attackerId,
      attackerType
    );
  }

  @TrackNewRelicTransaction()
  private async execute(
    entityEffect: IEntityEffect,
    remainingDurationMs: number,
    targetId: string,
    targetType: string,
    attackerId: string,
    attackerType: string
  ): Promise<void> {
    try {
      await this.newRelic.trackTransaction(
        NewRelicTransactionCategory.Operation,
        "EntityEffectCycle.execute",
        async () => {
          const target = await this.getTarget(targetId, targetType);
          if (!target) return await this.stopEffect(entityEffect, attackerId, targetId);

          if (!(await this.validateAndFilterEffects(target, entityEffect, attackerId))) return;

          if (!(await this.validateTargetCharacter(target, entityEffect, attackerId))) return;

          const attacker = await this.getTarget(attackerId, attackerType, true);
          const damage = await this.calculateDamage(entityEffect, target, attacker!);

          if (target.type === EntityType.NPC && attacker) {
            await this.recordNPCExperience(attacker, target, damage);
          }

          await this.updateEffectsAndState(attacker!, target, entityEffect, damage, remainingDurationMs, attackerId);
        }
      );
    } catch (error) {
      console.error(error);
      await this.stop(entityEffect.key, attackerId, targetId);
    }
  }

  private async stopEffect(entityEffect: IEntityEffect, attackerId: string, targetId: string): Promise<void> {
    await this.stop(entityEffect.key, attackerId, targetId);
  }

  private async validateAndFilterEffects(
    target: IEntity,
    entityEffect: IEntityEffect,
    attackerId: string
  ): Promise<boolean> {
    const appliedEffects = target.appliedEntityEffects ?? [];
    const currentEffectIndex = appliedEffects.findIndex((effect) => effect.key === entityEffect.key);
    if (currentEffectIndex < 0) {
      await this.stop(entityEffect.key, attackerId, target._id);
      return false;
    }
    return true;
  }

  private async validateTargetCharacter(
    target: IEntity,
    entityEffect: IEntityEffect,
    attackerId: string
  ): Promise<boolean> {
    if (target.type === EntityType.Character) {
      const targetCharacter = target as ICharacter;
      const hasBasicValidation = this.characterValidation.hasBasicValidation(targetCharacter);
      if (!hasBasicValidation) {
        await this.stop(entityEffect.key, attackerId, target._id);
        return false;
      }
    }
    return true;
  }

  private async calculateDamage(entityEffect: IEntityEffect, target: IEntity, attacker: IEntity): Promise<number> {
    let damage = await entityEffect.effect(target, attacker as ICharacter | INPC);
    damage = damage > target.health ? target.health : damage;
    return damage;
  }

  private async recordNPCExperience(attacker: IEntity, target: IEntity, damage: number): Promise<void> {
    await this.npcExperience.recordXPinBattle(attacker as ICharacter, target, damage);
  }

  private async updateEffectsAndState(
    attacker: IEntity,
    target: IEntity,
    entityEffect: IEntityEffect,
    damage: number,
    remainingDurationMs: number,
    attackerId: string
  ): Promise<void> {
    const runAgain = remainingDurationMs === -1 || remainingDurationMs >= entityEffect.intervalMs;
    if (!runAgain) {
      target.appliedEntityEffects = target.appliedEntityEffects!.filter((e) => e.key !== entityEffect.key);
    } else {
      const currentEffectIndex = target.appliedEntityEffects!.findIndex((effect) => effect.key === entityEffect.key);
      target.appliedEntityEffects![currentEffectIndex].lastUpdated = new Date().getTime();
      target.markModified("appliedEntityEffects");
    }
    const isAlive = await this.applyCharacterChanges(target, entityEffect, damage);
    if (!isAlive) {
      await this.handleDeath(target);
    }
    if (!runAgain || !isAlive) {
      await this.stop(entityEffect.key, attackerId, target._id);
      return;
    }
    remainingDurationMs = remainingDurationMs === -1 ? -1 : remainingDurationMs - entityEffect.intervalMs;
    const timer = container.get(TimerWrapper);
    timer.setTimeout(() => {
      this.execute(entityEffect, remainingDurationMs, target._id, target.type, attackerId, attacker.type);
    }, entityEffect.intervalMs);
  }

  private async getTarget(targetId: string, targetType: string, attacker?: boolean): Promise<ICharacter | INPC | null> {
    let target: ICharacter | INPC | null = null;
    if (targetType === EntityType.NPC) {
      target = (await NPC.findOne({ _id: targetId }).populate("skills")) as unknown as INPC;
    } else if (targetType === EntityType.Character) {
      if (attacker) {
        target = (await Character.findOne({ _id: targetId }).populate("skills")) as unknown as ICharacter;
      } else {
        target = (await Character.findOne({ _id: targetId })) as ICharacter;
      }
    }

    return target;
  }

  private async stop(entityEffectKey: string, attackerId: string, targetId: string): Promise<void> {
    await locker.unlock(`entity-effect-cycle-${entityEffectKey}-attacker-${attackerId}-target-${targetId}`);
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
    if (target.type === EntityType.Character) {
      this.animationEffect.sendAnimationEventToCharacter(target as ICharacter, effectKey as AnimationEffectKeys);
    } else {
      this.animationEffect.sendAnimationEventToNPC(target as INPC, effectKey);
    }
  }

  private async sendAttributeChangedEvent(target: ICharacter | INPC): Promise<void> {
    const payload: ICharacterAttributeChanged = {
      targetId: target._id,
      health: target.health,
      mana: target.mana,
      speed: target.speed,
    };

    if (target.type === EntityType.Character) {
      const character = target as ICharacter;

      this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.AttributeChanged, payload);
      await this.socketMessaging.sendEventToCharactersAroundCharacter(
        character,
        CharacterSocketEvents.AttributeChanged,
        payload
      );
    } else {
      await this.socketMessaging.sendEventToCharactersAroundNPC(
        target as INPC,
        CharacterSocketEvents.AttributeChanged,
        payload
      );
    }
  }

  private async handleDeath(target: ICharacter | INPC): Promise<void> {
    if (target.type === EntityType.Character) {
      await this.characterDeath.handleCharacterDeath(null, target as ICharacter);
    } else {
      await this.npcDeath.handleNPCDeath(target as INPC);
    }
  }
}
