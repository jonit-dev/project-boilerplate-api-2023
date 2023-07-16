import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterView } from "@providers/character/CharacterView";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import { CharacterMovementWarn } from "@providers/character/characterMovement/CharacterMovementWarn";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { NPCWarn } from "@providers/npc/NPCWarn";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { Bloodthirst } from "@providers/spells/data/logic/berserker/Bloodthirst";
import { ManaShield } from "@providers/spells/data/logic/mage/ManaShield";
import {
  BasicAttribute,
  BattleEventType,
  BattleSocketEvents,
  CharacterClass,
  EntityType,
  IBattleEventFromServer,
  ItemSubType,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

import random from "lodash/random";
import { BattleAttackTargetDeath } from "./BattleAttackTarget/BattleAttackTargetDeath";
import { BattleEffects } from "./BattleEffects";
import { BattleEvent } from "./BattleEvent";
import { TrackClassExecutionTime } from "@providers/analytics/decorator/TrackClassExecutionTime";

@TrackClassExecutionTime()
@provide(HitTarget)
export class HitTarget {
  constructor(
    private battleEvent: BattleEvent,
    private skillIncrease: SkillIncrease,
    private battleAttackTargetDeath: BattleAttackTargetDeath,
    private manaShield: ManaShield,
    private bloodthirst: Bloodthirst,
    private battleEffects: BattleEffects,
    private characterWeapon: CharacterWeapon,
    private characterView: CharacterView,
    private npcWarn: NPCWarn,
    private characterMovementWarn: CharacterMovementWarn,
    private socketMessaging: SocketMessaging,
    private entityEffectUse: EntityEffectUse
  ) {}

  @TrackNewRelicTransaction()
  public async hit(
    attacker: ICharacter | INPC,
    target: ICharacter | INPC,
    magicAttack?: boolean,
    bonusDamage?: number
  ): Promise<void> {
    if (!target.isAlive) {
      return;
    }

    const battleEvent: BattleEventType = magicAttack
      ? BattleEventType.Hit
      : await this.battleEvent.calculateEvent(attacker, target);

    let battleEventPayload: Partial<IBattleEventFromServer> = {
      attackerId: attacker.id,
      attackerType: attacker.type as "Character" | "NPC",
      targetId: target.id,
      targetType: target.type as "Character" | "NPC",
      eventType: battleEvent,
    };

    if (battleEvent === BattleEventType.Hit) {
      let baseDamage = await this.battleEvent.calculateHitDamage(attacker, target, magicAttack);

      if (bonusDamage) {
        baseDamage += bonusDamage;
      }

      const damage = this.battleEvent.getCriticalHitDamageIfSucceed(baseDamage);

      const generateBloodChance = random(1, 100);

      const effectGenerator =
        damage > 0 && generateBloodChance <= 10 ? this.battleEffects.generateBloodOnGround(target) : Promise.resolve();
      const damageRelatedPromises: any[] = [];

      if (damage > 0) {
        if (attacker.type === "Character") {
          const character = attacker as ICharacter;
          damageRelatedPromises.push(this.skillIncrease.increaseSkillsOnBattle(character, target, damage));
        }

        if (attacker.class === CharacterClass.Berserker) {
          const character = attacker as ICharacter;
          const berserkerSpell = this.bloodthirst.getBerserkerBloodthirstSpell(character);

          if (await berserkerSpell) {
            damageRelatedPromises.push(this.bloodthirst.handleBerserkerAttack(character, damage));
          }
        }

        let sorcererManaShield: boolean = false;
        if (target.class === CharacterClass.Sorcerer || target.class === CharacterClass.Druid) {
          const character = target as ICharacter;
          const manaShieldSpell = this.manaShield.getManaShieldSpell(character);

          if (await manaShieldSpell) {
            sorcererManaShield = await this.manaShield.handleManaShield(character, damage);
          }
        }

        if (!sorcererManaShield) {
          const newTargetHealth = target.health - damage;

          if (newTargetHealth <= 0) {
            target.health = 0;
            target.isAlive = false;
          } else {
            target.health -= damage;
          }

          if (target.type === "Character") {
            damageRelatedPromises.push(
              Character.updateOne({ _id: target.id, scene: target.scene }, { health: target.health })
            );
          }
          if (target.type === "NPC") {
            damageRelatedPromises.push(
              NPC.updateOne(
                {
                  _id: target.id,
                  scene: target.scene,
                },
                { health: target.health }
              )
            );
          }
        }

        battleEventPayload = {
          ...battleEventPayload,
          totalDamage: damage,
          postDamageTargetHP: target.health,
          isCriticalHit: damage > baseDamage,
        };

        const weaponPromise = this.characterWeapon.getWeapon(attacker as ICharacter);

        if (target.type === "Character") {
          const weapon = await weaponPromise;
          if (
            (weapon?.item && weapon?.item.subType === ItemSubType.Magic) ||
            (weapon?.item && weapon?.item.subType === ItemSubType.Staff)
          ) {
            damageRelatedPromises.push(
              this.skillIncrease.increaseMagicResistanceSP(target as ICharacter, this.getPower(weapon?.item))
            );
          } else {
            damageRelatedPromises.push(
              this.skillIncrease.increaseBasicAttributeSP(target as ICharacter, BasicAttribute.Resistance)
            );
          }
        }

        if (target.isAlive) {
          if (attacker.type === EntityType.Character) {
            damageRelatedPromises.push(this.applyEntityEffectsCharacter(attacker as ICharacter, target));
          } else if (attacker.type === EntityType.NPC) {
            damageRelatedPromises.push(this.applyEntityEffectsIfApplicable(attacker as INPC, target));
          }
        }
      }

      await Promise.all([effectGenerator, ...damageRelatedPromises]);
    }

    if (battleEvent === BattleEventType.Block && target.type === "Character") {
      await this.skillIncrease.increaseShieldingSP(target as ICharacter);
    }

    if (battleEvent === BattleEventType.Miss && target.type === "Character") {
      await this.skillIncrease.increaseBasicAttributeSP(target as ICharacter, BasicAttribute.Dexterity);
    }

    await this.warnCharacterIfNotInView(attacker as ICharacter, target);

    const character = attacker.type === "Character" ? (attacker as ICharacter) : (target as ICharacter);
    await this.sendBattleEvent(character, battleEventPayload as IBattleEventFromServer);
    await this.battleAttackTargetDeath.handleDeathAfterHit(attacker, target);
  }

  private async sendBattleEvent(character: ICharacter, battleEventPayload: IBattleEventFromServer): Promise<void> {
    // finally, send battleHitPayload to characters around

    const nearbyCharacters = await this.characterView.getCharactersInView(character);

    for (const nearbyCharacter of nearbyCharacters) {
      this.socketMessaging.sendEventToUser(
        nearbyCharacter.channelId!,
        BattleSocketEvents.BattleEvent,
        battleEventPayload
      );
    }

    // send battleEvent payload to origin character as well

    if (character.channelId) {
      this.socketMessaging.sendEventToUser(character.channelId, BattleSocketEvents.BattleEvent, battleEventPayload);
    }
  }

  private async applyEntityEffectsIfApplicable(npc: INPC, target: ICharacter | INPC): Promise<void> {
    const hasEntityEffects = npc?.entityEffects?.length! > 0;

    if (hasEntityEffects) {
      await this.entityEffectUse.applyEntityEffects(target, npc);
    }
  }

  private async applyEntityEffectsCharacter(character: ICharacter, target: ICharacter | INPC): Promise<void> {
    const weapon = await this.characterWeapon.getWeapon(character);

    if (!weapon) {
      return;
    }

    // if we have a ranged weapon without entity effects, just use the accessory one
    if (weapon?.item.subType === ItemSubType.Ranged && !weapon.item.entityEffects?.length!) {
      const equipment = await Equipment.findById(character.equipment).cacheQuery({
        cacheKey: `${character._id}-equipment`,
      });
      const accessory = await Item.findById(equipment?.accessory);
      await this.applyEntity(target, character, accessory as IItem);
    } else {
      // otherwise, apply the weapon entity effect.
      await this.applyEntity(target, character, weapon?.item as IItem);
    }
  }

  private async applyEntity(target: ICharacter | INPC, character: ICharacter | INPC, item: IItem): Promise<void> {
    const hasEntityEffect = item?.entityEffects?.length! > 0;
    const entityEffectChance = item?.entityEffectChance;
    if (hasEntityEffect && entityEffectChance) {
      const n = random(0, 100);
      if (entityEffectChance <= n) {
        return;
      }
      await this.entityEffectUse.applyEntityEffects(target, character);
    }
  }

  private async warnCharacterIfNotInView(character: ICharacter, target: ICharacter | INPC): Promise<void> {
    switch (target.type) {
      case "NPC":
        const isNPCInView = this.characterView.isOnCharacterView(character._id, target._id, "npcs");

        if (!isNPCInView) {
          await this.npcWarn.warnCharacterAboutSingleNPCCreation(target as INPC, character);
        }
        break;
      case "Character":
        const isCharacterOnCharView = this.characterView.isOnCharacterView(character._id, target._id, "characters");

        if (!isCharacterOnCharView) {
          await this.characterMovementWarn.warnAboutSingleCharacter(character, target as ICharacter);
        }

        break;
    }
  }

  private getPower = (item: IItem): number => {
    const attack = item?.attack ?? 0;
    const basePower = 15;

    if (attack < basePower) {
      return basePower;
    } else {
      return attack;
    }
  };
}
