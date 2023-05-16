import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
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
  public async applyEntityEffects(
    target: ICharacter | INPC,
    attacker: ICharacter | INPC,
    runeEffect?: IEntityEffect
  ): Promise<void> {
    // }
    try {
      // If runeEffect exists, apply it and exit
      if (runeEffect) {
        await this.applyEntityEffect(runeEffect, target, attacker, true);
        return;
      }

      // Get applicable entity effects and apply them concurrently
      const entityEffects = await this.getApplicableEntityEffects(attacker);
      await Promise.all(entityEffects.map((effect) => this.applyEntityEffect(effect, target, attacker)));
    } catch (error) {
      // Log any errors that occurred during the execution
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

  private async getApplicableEntityEffects(attacker: ICharacter | INPC): Promise<IEntityEffect[]> {
    const applicableEffects: IEntityEffect[] = [];
    if (attacker.type === EntityType.NPC) {
      const npc = attacker as INPC;
      const npcEffects = npc.entityEffects ?? [];

      npcEffects.forEach((effect) => {
        const entityEffect: IEntityEffect = entityEffectsBlueprintsIndex[effect];

        if (npc.attackType === EntityAttackType.MeleeRanged || npc.attackType === entityEffect.type) {
          applicableEffects.push(entityEffect);
        }
      });
    } else {
      const weapon = await this.characterWeapon.getWeapon(attacker as ICharacter);
      const weaponEffect = weapon?.item.entityEffects;
      if (weaponEffect?.length !== 0) {
        weaponEffect?.forEach((effect) => {
          const entityEffect: IEntityEffect = entityEffectsBlueprintsIndex[effect];
          applicableEffects.push(entityEffect);
        });
      } else {
        const character = attacker as ICharacter;
        const equipment = await Equipment.findById(character.equipment);
        const accessory = await Item.findById(equipment?.accessory);
        const accessoryEffect = accessory?.entityEffects;
        if (accessoryEffect) {
          accessoryEffect.forEach((effect) => {
            const entityEffect: IEntityEffect = entityEffectsBlueprintsIndex[effect];
            applicableEffects.push(entityEffect);
          });
        }
      }
    }

    return applicableEffects;
  }

  private async applyEntityEffect(
    entityEffect: IEntityEffect,
    target: ICharacter | INPC,
    attacker: ICharacter | INPC,
    skipProbability: boolean = false
  ): Promise<void> {
    const n = _.random(0, 100);
    if (entityEffect.probability <= n && !skipProbability) {
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
    this.startEntityEffectCycle(entityEffect, target, attacker);
  }

  private startEntityEffectCycle(
    entityEffect: IEntityEffect,
    target: ICharacter | INPC,
    attacker: ICharacter | INPC
  ): void {
    new EntityEffectCycle(entityEffect, target._id, target.type, attacker._id, attacker.type);
  }
}
