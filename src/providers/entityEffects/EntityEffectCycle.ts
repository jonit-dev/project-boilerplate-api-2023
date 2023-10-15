import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { locker } from "@providers/inversify/container";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { NPCExperience } from "@providers/npc/NPCExperience/NPCExperience";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { AnimationEffectKeys, CharacterSocketEvents, EntityType, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EntityEffectDurationControl } from "./EntityEffectDurationControl";
import { IEntityEffect } from "./data/blueprints/entityEffect";

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
    private npcDeath: NPCDeath,
    private entityEffectDurationControl: EntityEffectDurationControl
  ) {}

  public async start(
    entityEffect: IEntityEffect,
    targetId: string,
    targetType: string,
    attackerId: string,
    attackerType: string
  ): Promise<void> {
    await this.entityEffectDurationControl.setDuration(
      entityEffect.key,
      targetId,
      attackerId,
      entityEffect.totalDurationMs ?? -1
    );

    await this.execute(
      entityEffect,

      targetId,
      targetType,
      attackerId,
      attackerType
    );
  }

  @TrackNewRelicTransaction()
  private async execute(
    entityEffect: IEntityEffect,

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

          await this.updateEffectsAndState(attacker!, target, entityEffect, attackerId);
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
    attackerId: string
  ): Promise<void> {
    try {
      const remainingDurationMs = await this.entityEffectDurationControl.getDuration(
        entityEffect.key,
        target._id,
        attackerId
      );

      // Robust exit condition 1: Stop if the duration is null
      if (remainingDurationMs === null || typeof remainingDurationMs === "undefined") {
        await this.stop(entityEffect.key, attackerId, target._id);
        return;
      }

      const runAgain = remainingDurationMs > 0 && remainingDurationMs >= entityEffect.intervalMs;

      if (!runAgain) {
        target.appliedEntityEffects = target.appliedEntityEffects!.filter((e) => e.key !== entityEffect.key);
        await this.stop(entityEffect.key, attackerId, target._id);
        return;
      }

      const currentEffectIndex = target.appliedEntityEffects!.findIndex((effect) => effect.key === entityEffect.key);
      target.appliedEntityEffects![currentEffectIndex].lastUpdated = new Date().getTime();
      target.markModified("appliedEntityEffects");

      const isAlive = await this.applyCharacterChanges(attacker, target, entityEffect);

      // Robust exit condition 2: Stop if the target is not alive
      if (!isAlive) {
        await this.handleDeath(attacker, target);
        await this.stop(entityEffect.key, attackerId, target._id);
        return;
      }

      const newRemainingDurationMs = remainingDurationMs - entityEffect.intervalMs;
      await this.entityEffectDurationControl.setDuration(
        entityEffect.key,
        target._id,
        attackerId,
        newRemainingDurationMs
      );

      // set a minimum interval MS to avoid setTimeout causing spikes
      if (!entityEffect.intervalMs || entityEffect.intervalMs <= 1000) {
        entityEffect.intervalMs = 1000;
      }

      // Only set the timeout if the conditions are met.
      if (runAgain && isAlive) {
        setTimeout(async () => {
          await this.execute(entityEffect, target._id, target.type, attackerId, attacker.type);
        }, entityEffect.intervalMs);
      }
    } catch (error) {
      console.error(`Error in updateEffectsAndState: ${error}`);
      await this.stop(entityEffect.key, attackerId, target._id);
    }
  }

  private async findEntityById(
    targetId: string,
    entityType: string,
    populateSkills = false
  ): Promise<ICharacter | INPC | null> {
    const entityModel = entityType === EntityType.NPC ? NPC : Character;
    const query = entityModel.findOne({ _id: targetId });
    if (populateSkills) {
      await query.populate("skills");
    }
    return await query;
  }

  private async updateEntity(entity: ICharacter | INPC, updates: any): Promise<void> {
    const entityModel = entity.type === EntityType.Character ? Character : NPC;
    await entityModel.updateOne({ _id: entity.id }, { $set: updates });
  }

  private async unlockEntityEffectCycle(entityEffectKey: string, attackerId: string, targetId: string): Promise<void> {
    await locker.unlock(`entity-effect-cycle-${entityEffectKey}-attacker-${attackerId}-target-${targetId}`);
  }

  private async getTarget(targetId: string, targetType: string, attacker?: boolean): Promise<ICharacter | INPC | null> {
    return await this.findEntityById(targetId, targetType, attacker);
  }

  private async stop(entityEffectKey: string, attackerId: string, targetId: string): Promise<void> {
    await this.unlockEntityEffectCycle(entityEffectKey, attackerId, targetId);
    await this.entityEffectDurationControl.clear(entityEffectKey, targetId, attackerId);
  }

  private async applyCharacterChanges(
    attacker: IEntity,
    target: IEntity,
    entityEffect: IEntityEffect
  ): Promise<boolean> {
    if (!target.isAlive) {
      await this.handleDeath(attacker, target);
      return false;
    }

    await this.updateEntity(target, {
      appliedEntityEffects: target.appliedEntityEffects,
      health: target.health,
    });

    await this.sendAnimationEvent(target, entityEffect.targetAnimationKey as AnimationEffectKeys);
    await this.sendAttributeChangedEvent(target as ICharacter);

    return true;
  }

  private async sendAnimationEvent(target, effectKey: AnimationEffectKeys): Promise<void> {
    const method = target.type === EntityType.Character ? "sendAnimationEventToCharacter" : "sendAnimationEventToNPC";
    await this.animationEffect[method](target, effectKey);
  }

  private async sendAttributeChangedEvent(target: ICharacter): Promise<void> {
    const payload: ICharacterAttributeChanged = {
      targetId: target._id,
      health: target.health,
      mana: target.mana,
      speed: target.speed,
    };

    const eventMethod =
      target.type === EntityType.Character ? "sendEventToCharactersAroundCharacter" : "sendEventToCharactersAroundNPC";
    this.socketMessaging.sendEventToUser(target.channelId!, CharacterSocketEvents.AttributeChanged, payload);
    await this.socketMessaging[eventMethod](target as any, CharacterSocketEvents.AttributeChanged, payload);
  }

  private async handleDeath(attacker: IEntity, target: IEntity): Promise<void> {
    switch (target.type) {
      case EntityType.Character:
        await this.characterDeath.handleCharacterDeath(attacker, target as ICharacter);
        break;
      case EntityType.NPC:
        await this.npcDeath.handleNPCDeath(target as INPC);
        break;
    }
  }
}
