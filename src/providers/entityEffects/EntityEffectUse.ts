import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import { appEnv } from "@providers/config/env";
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
  constructor(private socketMessaging: SocketMessaging, private characterWeapon: CharacterWeapon) {}

  @TrackNewRelicTransaction()
  public async applyEntityEffects(
    target: ICharacter | INPC,
    attacker: ICharacter | INPC,
    entityEffect?: IEntityEffect
  ): Promise<void> {
    try {
      if (entityEffect) {
        await this.applyEntityEffect(entityEffect, target, attacker, true);
        return;
      }

      const entityEffects = await this.getApplicableEntityEffects(attacker);
      await Promise.all(entityEffects.map((effect) => this.applyEntityEffect(effect, target, attacker)));
    } catch (error) {
      console.error(`Error in applyEntityEffects: ${error}`);
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
    await this.updateTargetInDatabase(target);

    if (target.type === EntityType.Character) {
      const character = target as ICharacter;
      this.socketMessaging.sendEventToUser(character.channelId!, UISocketEvents.ShowMessage, {
        message: `The following effect was cured: ${effectKey.toLowerCase()}.`,
      });
    }
  }

  public async clearAllEntityEffects(target: ICharacter | INPC): Promise<void> {
    const updateData = { $unset: { appliedEntityEffects: 1 } } as any;

    switch (target.type) {
      case EntityType.Character:
        await Character.updateOne({ _id: target._id }, updateData);
        break;
      case EntityType.NPC:
        await NPC.updateOne({ _id: target._id }, updateData);
        break;
    }
  }

  private async getApplicableEntityEffects(attacker: ICharacter | INPC): Promise<IEntityEffect[]> {
    return attacker.type === EntityType.NPC
      ? await this.getApplicableEntityEffectsFromNPC(attacker as INPC)
      : await this.getApplicableEntityEffectsFromCharacter(attacker as ICharacter);
  }

  private async getApplicableEntityEffectsFromCharacter(attacker: ICharacter): Promise<IEntityEffect[]> {
    const applicableEffects: IEntityEffect[] = [];
    const weapon = await this.characterWeapon.getWeapon(attacker);
    const weaponEffect = weapon?.item.entityEffects;
    if (weaponEffect?.length !== 0) {
      weaponEffect?.forEach((effect) => {
        const entityEffect: IEntityEffect = entityEffectsBlueprintsIndex[effect];
        applicableEffects.push(entityEffect);
      });
    } else {
      const equipment = await Equipment.findById(attacker.equipment).cacheQuery({
        cacheKey: `${attacker._id}-equipment`,
      });
      const accessory = await Item.findById(equipment?.accessory);
      const accessoryEffect = accessory?.entityEffects;

      if (accessoryEffect) {
        accessoryEffect.forEach((effect) => {
          const entityEffect: IEntityEffect = entityEffectsBlueprintsIndex[effect];
          applicableEffects.push(entityEffect);
        });
      }
    }

    return applicableEffects;
  }

  private getApplicableEntityEffectsFromNPC(attacker: INPC): IEntityEffect[] {
    const applicableEffects: IEntityEffect[] = [];
    const npcEffects = attacker.entityEffects ?? [];
    npcEffects.forEach((effect) => {
      const entityEffect: IEntityEffect = entityEffectsBlueprintsIndex[effect];

      if (attacker.attackType === EntityAttackType.MeleeRanged || attacker.attackType === entityEffect.type) {
        applicableEffects.push(entityEffect);
      }
    });

    return applicableEffects;
  }

  private async applyEntityEffect(
    entityEffect: IEntityEffect,
    target: ICharacter | INPC,
    attacker: ICharacter | INPC,
    skipProbability: boolean = false
  ): Promise<void> {
    const randomNumber = _.random(0, 100);
    if (entityEffect.probability <= randomNumber && !skipProbability) {
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
    await this.updateTargetInDatabase(target);
    this.startEntityEffectCycle(entityEffect, target, attacker);
  }

  private async updateTargetInDatabase(target: ICharacter | INPC): Promise<void> {
    const updateData = { $set: { appliedEntityEffects: target.appliedEntityEffects } };

    if (target.type === "Character") {
      await Character.updateOne({ _id: target.id }, updateData);
    } else if (target.type === "NPC") {
      await NPC.updateOne({ _id: target.id }, updateData);
    }
  }

  private startEntityEffectCycle(
    entityEffect: IEntityEffect,
    target: ICharacter | INPC,
    attacker: ICharacter | INPC
  ): void {
    if (appEnv.general.IS_UNIT_TEST) {
      //! This avoids the creation of EntityEffectCycle during unit tests because it was causing a character model buff timeout issue (I have no idea why)
      return;
    }
    new EntityEffectCycle(entityEffect, target._id, target.type, attacker._id, attacker.type);
  }
}
