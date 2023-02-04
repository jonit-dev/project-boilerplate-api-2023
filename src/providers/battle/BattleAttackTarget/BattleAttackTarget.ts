import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { CharacterView } from "@providers/character/CharacterView";
import { CharacterBonusPenalties } from "@providers/character/characterBonusPenalties/CharacterBonusPenalties";
import { CharacterMovementWarn } from "@providers/character/characterMovement/CharacterMovementWarn";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { NPCWarn } from "@providers/npc/NPCWarn";
import { NPCTarget } from "@providers/npc/movement/NPCTarget";
import { QuestSystem } from "@providers/quest/QuestSystem";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  BasicAttribute,
  BattleEventType,
  BattleSocketEvents,
  GRID_WIDTH,
  IBattleCancelTargeting,
  IBattleEventFromServer,
  ItemSubType,
  QuestType,
  SOCKET_TRANSMISSION_ZONE_WIDTH,
} from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { BattleEffects } from "../BattleEffects";
import { BattleEvent } from "../BattleEvent";
import { BattleRangedAttack } from "../BattleRangedAttack";
import { BattleNetworkStopTargeting } from "../network/BattleNetworkStopTargetting";

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
    private characterDeath: CharacterDeath,
    private npcDeath: NPCDeath,
    private skillIncrease: SkillIncrease,
    private battleRangedAttack: BattleRangedAttack,
    private questSystem: QuestSystem,
    private entityEffectUse: EntityEffectUse,
    private characterBonusPenalties: CharacterBonusPenalties,
    private npcWarn: NPCWarn,
    private characterMovementWarn: CharacterMovementWarn
  ) {}

  public async checkRangeAndAttack(attacker: ICharacter | INPC, target: ICharacter | INPC): Promise<boolean> {
    if (!target.isAlive) {
      return false;
    }

    switch (await attacker?.attackType) {
      case EntityAttackType.Melee: {
        const isUnderMeleeRange = this.movementHelper.isUnderRange(attacker.x, attacker.y, target.x, target.y, 1.5);

        if (isUnderMeleeRange) {
          await this.hitTarget(attacker, target);

          return true;
        }

        break;
      }

      case EntityAttackType.Ranged:
        const rangedAttackParams = await this.battleRangedAttack.validateAttack(attacker, target);

        if (rangedAttackParams) {
          await this.hitTarget(attacker, target);
          await this.battleRangedAttack.sendRangedAttackEvent(attacker, target, rangedAttackParams);

          if (attacker.type === "Character") {
            if (rangedAttackParams.itemSubType === ItemSubType.Magic) {
              return true;
            } else {
              await this.battleRangedAttack.consumeAmmo(rangedAttackParams, attacker as ICharacter);

              return true;
            }
          }
        }
        break;
      /* 
      NPCs can have a hybrid attack type
      if closer enough, would be melee attack
      otherwise would be ranged attack 
      */
      case EntityAttackType.MeleeRanged: {
        if (attacker.type === "Character") {
          throw new Error(`Character cannot have MeleeRanged hybrid attack type. Character id ${attacker.id}`);
        }

        const isUnderMeleeRange = this.movementHelper.isUnderRange(attacker.x, attacker.y, target.x, target.y, 1);

        if (isUnderMeleeRange) {
          await this.hitTarget(attacker, target);

          return true;
        } else {
          const rangedAttackParams = await this.battleRangedAttack.validateAttack(attacker, target);

          if (rangedAttackParams) {
            await this.hitTarget(attacker, target);
            await this.battleRangedAttack.sendRangedAttackEvent(attacker, target, rangedAttackParams);

            return true;
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

  private async hitTarget(attacker: ICharacter | INPC, target: ICharacter | INPC): Promise<void> {
    // if target is dead, do nothing.
    if (!target.isAlive) {
      return;
    }

    const battleEvent = await this.battleEvent.calculateEvent(attacker, target);

    let battleEventPayload: Partial<IBattleEventFromServer> = {
      targetId: target.id,
      targetType: target.type as "Character" | "NPC",
      eventType: battleEvent,
    };

    if (battleEvent === BattleEventType.Hit) {
      const damage = await this.battleEvent.calculateHitDamage(attacker, target);
      if (damage > 0) {
        // Increase attacker SP for weapon used and XP (if is character)
        if (attacker.type === "Character") {
          const character = attacker as ICharacter;
          await this.skillIncrease.increaseSkillsOnBattle(character, target, damage);
        }

        // Update target health
        const newTargetHealth = target.health - damage;

        if (newTargetHealth <= 0) {
          target.health = 0;
        } else {
          target.health -= damage;
        }
        await target.save();

        const n = _.random(0, 100);

        if (n <= 30) {
          await this.battleEffects.generateBloodOnGround(target);
        }

        battleEventPayload = {
          ...battleEventPayload,
          totalDamage: damage,
          postDamageTargetHP: target.health,
        };

        // when target is Character, resistance SP increases
        if (target.type === "Character") {
          const weapon = await (attacker as ICharacter).weapon;
          const attr =
            weapon?.subType === ItemSubType.Magic || weapon?.subType === ItemSubType.Staff
              ? BasicAttribute.MagicResistance
              : BasicAttribute.Resistance;
          await this.skillIncrease.increaseBasicAttributeSP(target as ICharacter, attr);

          await this.characterBonusPenalties.applyRaceBonusPenalties(target as ICharacter, attr);
        }

        /*
        Check if character is dead after damage calculation. 
        If so, send death event to client and characters around.
        */

        if (!target.isAlive) {
          if (target.type === "Character") {
            // freeze target variable, so it does not receive any modifications
            const targetCharacter = Object.freeze(target as ICharacter);

            await this.battleEffects.generateBloodOnGround(targetCharacter);

            await this.characterDeath.handleCharacterDeath(attacker, targetCharacter as ICharacter);

            // Attacker could be a Character (PVP battle)
            if (attacker.type === "NPC") {
              await this.npcTarget.clearTarget(attacker as INPC);
              await this.npcTarget.tryToSetTarget(attacker as INPC);
            } else {
              await this.battleNetworkStopTargeting.stopTargeting(attacker as ICharacter);
            }
          }
          if (target.type === "NPC") {
            await this.battleEffects.generateBloodOnGround(target);
            await this.npcDeath.handleNPCDeath(target as INPC, attacker as ICharacter);
            await this.skillIncrease.releaseXP(target as INPC);

            if (attacker instanceof Character) {
              // update kill quests status (if any)
              await this.questSystem.updateQuests(QuestType.Kill, attacker as ICharacter, (target as INPC).key);

              // clear attacker target
              await this.battleNetworkStopTargeting.stopTargeting(attacker as ICharacter);
            }
          }
        } else if (attacker.type === EntityType.NPC) {
          const npc = attacker as INPC;

          const hasEntityEffects = npc?.entityEffects?.length! > 0;

          if (hasEntityEffects) {
            await this.entityEffectUse.applyEntityEffects(target, attacker as INPC);
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

      await this.characterBonusPenalties.applyRaceBonusPenalties(target as ICharacter, BasicAttribute.Dexterity);
    }

    await this.warnCharacterIfNotInView(attacker as ICharacter, target);

    // finally, send battleHitPayload to characters around
    const character = attacker.type === "Character" ? (attacker as ICharacter) : (target as ICharacter);

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
}
