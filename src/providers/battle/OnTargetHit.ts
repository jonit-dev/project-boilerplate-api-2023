import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { QuestSystem } from "@providers/quest/QuestSystem";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { EntityType, QuestType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { BattleEffects } from "./BattleEffects";

@provide(OnTargetHit)
export class OnTargetHit {
  constructor(
    private characterDeath: CharacterDeath,
    private npcDeath: NPCDeath,
    private skillIncrease: SkillIncrease,
    private questSystem: QuestSystem,
    private battleEffects: BattleEffects
  ) {}

  async execute(target: ICharacter | INPC, attacker: ICharacter | INPC, damage: number): Promise<void> {
    if (damage) {
      await this.generateBloodOnGround(target);
      await this.handleSkillIncrease(attacker as ICharacter, target, damage);
    }

    if (!target.isAlive) {
      await this.handleDeath(target, attacker);
      await this.updateQuests(target, attacker);
    }
  }

  private async handleDeath(target: ICharacter | INPC, attacker: ICharacter | INPC): Promise<void> {
    if (target.type === EntityType.Character) {
      await this.characterDeath.handleCharacterDeath(attacker, target as ICharacter);
    } else {
      await this.npcDeath.handleNPCDeath(target as INPC);
    }
  }

  private async handleSkillIncrease(attacker: ICharacter, target: ICharacter | INPC, damage: number): Promise<void> {
    await this.skillIncrease.recordXPinBattle(attacker, target, damage);

    if (target.type === EntityType.NPC && !target.isAlive) {
      await this.skillIncrease.releaseXP(target as INPC);
    }
  }

  private async updateQuests(target: ICharacter | INPC, attacker: ICharacter | INPC): Promise<void> {
    if (attacker.type === EntityType.Character && target.type === EntityType.NPC) {
      await this.questSystem.updateQuests(QuestType.Kill, attacker as ICharacter, (target as INPC).key);
    }
  }

  private async generateBloodOnGround(target: ICharacter | INPC): Promise<void> {
    const n = _.random(0, 100);

    if (n <= 30) {
      await this.battleEffects.generateBloodOnGround(target);
    }
  }
}
