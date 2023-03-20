import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { NPCTarget } from "@providers/npc/movement/NPCTarget";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { QuestSystem } from "@providers/quest/QuestSystem";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { QuestType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { BattleEffects } from "../BattleEffects";
import { BattleNetworkStopTargeting } from "../network/BattleNetworkStopTargetting";

@provide(BattleAttackTargetDeath)
export class BattleAttackTargetDeath {
  constructor(
    private battleEffects: BattleEffects,
    private characterDeath: CharacterDeath,
    private npcTarget: NPCTarget,
    private npcDeath: NPCDeath,
    private skillIncrease: SkillIncrease,
    private questSystem: QuestSystem,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting
  ) {}

  public async handleDeathAfterHit(attacker: ICharacter | INPC, target: ICharacter | INPC): Promise<void> {
    if (!target.isAlive) {
      await this.battleEffects.generateBloodOnGround(target);

      if (target.type === "Character") {
        await this.handleCharacterDeath(attacker, target as ICharacter);
      } else if (target.type === "NPC") {
        await this.handleNPCDeath(attacker, target as INPC);
      }
    }
  }

  private async handleCharacterDeath(attacker: ICharacter | INPC, targetCharacter: ICharacter): Promise<void> {
    await this.characterDeath.handleCharacterDeath(attacker, targetCharacter);

    if (attacker.type === "NPC") {
      await this.npcTarget.clearTarget(attacker as INPC);
      await this.npcTarget.tryToSetTarget(attacker as INPC);
    } else {
      await this.battleNetworkStopTargeting.stopTargeting(attacker as ICharacter);
    }
  }

  private async handleNPCDeath(attacker: ICharacter | INPC, targetNPC: INPC): Promise<void> {
    await this.npcDeath.handleNPCDeath(targetNPC);
    await this.skillIncrease.releaseXP(targetNPC);

    if (attacker instanceof Character) {
      await this.questSystem.updateQuests(QuestType.Kill, attacker as ICharacter, targetNPC.key);
      await this.battleNetworkStopTargeting.stopTargeting(attacker as ICharacter);
    }
  }
}