import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { QuestSystem } from "@providers/quest/QuestSystem";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { EffectsSocketEvents, EntityType, IEntityEffectEvent, QuestType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { BattleEffects } from "./BattleEffects";
import _ from "lodash";

@provide(OnTargetHit)
export class OnTargetHit {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterDeath: CharacterDeath,
    private npcDeath: NPCDeath,
    private skillIncrease: SkillIncrease,
    private questSystem: QuestSystem,
    private battleEffects: BattleEffects
  ) {}

  async execute(target: ICharacter | INPC, attacker: ICharacter | INPC, damage: number): Promise<void> {
    if (damage) {
      await this.sendDamageEvent(target, damage);
      await this.generateBlookOnGround(target);
    }

    if (!target.isAlive) {
      await this.handleDeath(target, attacker);
      await this.handleSkillIncrease(target);
      await this.updateQuests(target, attacker);
    }
  }

  private async sendDamageEvent(target: ICharacter | INPC, damage: number): Promise<void> {
    const payload: IEntityEffectEvent = {
      targetId: target._id,
      targetType: target.type as EntityType,
      value: damage,
    };

    if (target.type === EntityType.Character) {
      const character = target as ICharacter;

      this.socketMessaging.sendEventToUser(character.channelId!, EffectsSocketEvents.EntityEffect, payload);
      await this.socketMessaging.sendEventToCharactersAroundCharacter(
        character,
        EffectsSocketEvents.EntityEffect,
        payload
      );
    } else {
      await this.socketMessaging.sendEventToCharactersAroundNPC(
        target as INPC,
        EffectsSocketEvents.EntityEffect,
        payload
      );
    }
  }

  private async handleDeath(target: ICharacter | INPC, attacker: ICharacter | INPC): Promise<void> {
    if (target.type === EntityType.Character) {
      await this.characterDeath.handleCharacterDeath(attacker, target as ICharacter);
    } else {
      await this.npcDeath.handleNPCDeath(target as INPC, attacker as ICharacter);
    }
  }

  private async handleSkillIncrease(target: ICharacter | INPC): Promise<void> {
    if (target.type !== EntityType.NPC) {
      return;
    }

    await this.skillIncrease.releaseXP(target as INPC);
  }

  private async updateQuests(target: ICharacter | INPC, attacker: ICharacter | INPC): Promise<void> {
    if (attacker.type === EntityType.Character && target.type === EntityType.NPC) {
      await this.questSystem.updateQuests(QuestType.Kill, attacker as ICharacter, (target as INPC).key);
    }
  }

  private async generateBlookOnGround(target: ICharacter | INPC): Promise<void> {
    const n = _.random(0, 100);

    if (n <= 30) {
      await this.battleEffects.generateBloodOnGround(target);
    }
  }
}
