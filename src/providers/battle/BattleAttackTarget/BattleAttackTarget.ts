import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { CharacterView } from "@providers/character/CharacterView";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import { CharacterMovementWarn } from "@providers/character/characterMovement/CharacterMovementWarn";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { NPCWarn } from "@providers/npc/NPCWarn";
import { NPCTarget } from "@providers/npc/movement/NPCTarget";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { Execution } from "@providers/spells/data/logic/berserker/Execution";

import { Bloodthirst } from "@providers/spells/data/logic/berserker/Bloodthirst";
import { ManaShield } from "@providers/spells/data/logic/mage/ManaShield";
import {
  BasicAttribute,
  BattleEventType,
  BattleSocketEvents,
  CharacterClass,
  GRID_WIDTH,
  IBattleCancelTargeting,
  IBattleEventFromServer,
  ItemSubType,
  SOCKET_TRANSMISSION_ZONE_WIDTH,
} from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { BattleEffects } from "../BattleEffects";
import { BattleEvent } from "../BattleEvent";
import { BattleNetworkStopTargeting } from "../network/BattleNetworkStopTargetting";
import { BattleAttackRanged } from "./BattleAttackRanged";
import { BattleAttackTargetDeath } from "./BattleAttackTargetDeath";
import { BattleAttackValidator } from "./BattleAttackValidator";

@provide(BattleAttackTarget)
export class BattleAttackTarget {
  constructor(
    private battleEvent: BattleEvent,
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private movementHelper: MovementHelper,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting,
    private npcTarget: NPCTarget,
    private battleEffects: BattleEffects,
    private characterDeath: CharacterDeath, //! dont remove this
    private skillIncrease: SkillIncrease,
    private battleRangedAttack: BattleAttackRanged,
    private npcWarn: NPCWarn,
    private characterMovementWarn: CharacterMovementWarn,
    private characterWeapon: CharacterWeapon,
    private battleAttackValidator: BattleAttackValidator,
    private battleAttackTargetDeath: BattleAttackTargetDeath,
    private entityEffectUse: EntityEffectUse,
    private berserkerSpells: Execution,
    private manaShield: ManaShield,
    private bloodthirst: Bloodthirst
  ) {}

  public async checkRangeAndAttack(attacker: ICharacter | INPC, target: ICharacter | INPC): Promise<boolean> {
    if (!target.isAlive) {
      return false;
    }

    const attackerType = attacker.attackType || (await this.characterWeapon.getAttackType(attacker as ICharacter));

    const performRangedAttack = async (
      attacker: ICharacter | INPC,
      target: ICharacter | INPC,
      rangedAttackParams: any,
      magicAttack = false
    ): Promise<boolean> => {
      await this.hitTarget(attacker, target, magicAttack);
      await this.battleRangedAttack.sendRangedAttackEvent(attacker, target, rangedAttackParams);
      if (attacker.type === "Character" && rangedAttackParams.itemSubType === ItemSubType.Ranged) {
        await this.battleRangedAttack.consumeAmmo(rangedAttackParams, attacker as ICharacter);
      }
      return true;
    };

    switch (attackerType) {
      case EntityAttackType.Melee: {
        const isUnderMeleeRange = this.movementHelper.isUnderRange(attacker.x, attacker.y, target.x, target.y, 1.5);

        if (isUnderMeleeRange) {
          await this.hitTarget(attacker, target);
          return true;
        }
        break;
      }

      case EntityAttackType.Ranged: {
        const rangedAttackParams = await this.battleAttackValidator.validateAttack(attacker, target);

        if (rangedAttackParams) {
          if (attacker.type === "Character") {
            const character = attacker as ICharacter;
            if (rangedAttackParams.itemSubType === ItemSubType.Magic) {
              return performRangedAttack(attacker, target, rangedAttackParams);
            } else if (rangedAttackParams.itemSubType === ItemSubType.Staff) {
              const attack = await this.battleAttackValidator.validateMagicAttack(character._id, {
                targetId: target.id,
                targetType: target.type as EntityType,
              });

              if (attack) {
                return performRangedAttack(attacker, target, rangedAttackParams, true);
              }
              return attack;
            } else if (rangedAttackParams.itemSubType === ItemSubType.Ranged) {
              return performRangedAttack(attacker, target, rangedAttackParams);
            }
          } else {
            return performRangedAttack(attacker, target, rangedAttackParams);
          }
        }
        break;
      }

      case EntityAttackType.MeleeRanged: {
        if (attacker.type === "Character") {
          throw new Error(`Character cannot have MeleeRanged hybrid attack type. Character id ${attacker.id}`);
        }

        const isUnderMeleeRange = this.movementHelper.isUnderRange(attacker.x, attacker.y, target.x, target.y, 1);

        if (isUnderMeleeRange) {
          await this.hitTarget(attacker, target);
          return true;
        } else {
          const rangedAttackParams = await this.battleAttackValidator.validateAttack(attacker, target);

          if (rangedAttackParams) {
            return performRangedAttack(attacker, target, rangedAttackParams);
          }
        }
        break;
      }

      default: {
        return false;
      }
    }

    const isTargetClose = this.movementHelper.isUnderRange(
      attacker.x,
      attacker.y,
      target.x,
      target.y,
      (SOCKET_TRANSMISSION_ZONE_WIDTH * 2) / GRID_WIDTH / 2
    );

    if (!isTargetClose) {
      if (attacker.type === "Character") {
        const character = attacker as ICharacter;
        await this.battleNetworkStopTargeting.stopTargeting(character);

        this.socketMessaging.sendEventToUser<IBattleCancelTargeting>(
          character.channelId!,
          BattleSocketEvents.CancelTargeting,
          {
            targetId: target.id,
            type: target.type as EntityType,
            reason: "Your battle target was lost.",
          }
        );
      }

      if (attacker.type === "NPC") {
        const npc = attacker as INPC;
        await this.npcTarget.tryToClearOutOfRangeTargets(npc);
      }

      return false;
    }

    return true;
  }

  private async hitTarget(
    attacker: ICharacter | INPC,
    target: ICharacter | INPC,
    magicAttack?: boolean
  ): Promise<void> {
    // if target is dead, do nothing.
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
      const baseDamage = await this.battleEvent.calculateHitDamage(attacker, target, magicAttack);
      const damage = await this.battleEvent.getCriticalHitDamageIfSucceed(baseDamage);

      if (damage > 0) {
        // Increase attacker SP for weapon used and XP (if is character)
        if (attacker.type === "Character") {
          const character = attacker as ICharacter;
          await this.skillIncrease.increaseSkillsOnBattle(character, target, damage);
        }

        if (attacker.class === CharacterClass.Berserker) {
          const character = attacker as ICharacter;

          const isActive = await this.bloodthirst.getBerserkerBloodthirstSpell(character);
          if (isActive) {
            await this.bloodthirst.handleBerserkerAttack(character, damage);
          }
        }

        let sorcererManaShield: boolean = false;
        if (target.class === CharacterClass.Sorcerer || target.class === CharacterClass.Druid) {
          const character = target as ICharacter;

          const isActive = await this.manaShield.getManaShieldSpell(character);
          if (isActive) {
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
            await Character.updateOne({ _id: target.id }, { health: target.health });
          }
          if (target.type === "NPC") {
            await NPC.updateOne({ _id: target.id }, { health: target.health });
          }
        }

        const n = _.random(0, 100);

        if (n <= 30) {
          await this.battleEffects.generateBloodOnGround(target);
        }

        battleEventPayload = {
          ...battleEventPayload,
          totalDamage: damage,
          postDamageTargetHP: target.health,
          isCriticalHit: damage > baseDamage,
        };

        // when target is Character, resistance SP increases
        if (target.type === "Character") {
          const weapon = await this.characterWeapon.getWeapon(attacker as ICharacter);

          if (
            (weapon?.item && weapon?.item.subType === ItemSubType.Magic) ||
            (weapon?.item && weapon?.item.subType === ItemSubType.Staff)
          ) {
            await this.skillIncrease.increaseMagicResistanceSP(target as ICharacter, this.getPower(weapon?.item));
          } else {
            await this.skillIncrease.increaseBasicAttributeSP(target as ICharacter, BasicAttribute.Resistance);
          }
        }

        // apply Entity Effects
        if (target.isAlive) {
          if (attacker.type === EntityType.Character) {
            await this.applyEntityEffectsCharacter(attacker as ICharacter, target);
          } else if (attacker.type === EntityType.NPC) {
            await this.applyEntityEffectsIfApplicable(attacker as INPC, target);
          }
        }
      }
    }

    // When block attack, increase shielding SP in target (if is Character)
    if (battleEvent === BattleEventType.Block && target.type === "Character") {
      await this.skillIncrease.increaseShieldingSP(target as ICharacter);
    }

    // if battle event was a Miss, the character dodged the hit
    // then, increase the character's dexterity SP
    if (battleEvent === BattleEventType.Miss && target.type === "Character") {
      await this.skillIncrease.increaseBasicAttributeSP(target as ICharacter, BasicAttribute.Dexterity);
    }

    await this.warnCharacterIfNotInView(attacker as ICharacter, target);

    // finally, send battleHitPayload to characters around
    const character = attacker.type === "Character" ? (attacker as ICharacter) : (target as ICharacter);

    await this.sendBattleEvent(character, battleEventPayload as IBattleEventFromServer);

    /*
    Check if character is dead. 
    If so, send death event to client and characters around.
    */
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
      const equipment = await Equipment.findById(character.equipment);
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
      const n = _.random(0, 100);
      if (entityEffectChance <= n) {
        return;
      }
      await this.entityEffectUse.applyEntityEffects(target, character);
    }
  }

  private async warnCharacterIfNotInView(character: ICharacter, target: ICharacter | INPC): Promise<void> {
    switch (target.type) {
      case "NPC":
        const isNPCInView = this.characterView.isOnCharacterView(character, target._id, "npcs");

        if (!isNPCInView) {
          await this.npcWarn.warnCharacterAboutSingleNPCCreation(target as INPC, character);
        }
        break;
      case "Character":
        const isCharacterOnCharView = this.characterView.isOnCharacterView(character, target._id, "characters");

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
