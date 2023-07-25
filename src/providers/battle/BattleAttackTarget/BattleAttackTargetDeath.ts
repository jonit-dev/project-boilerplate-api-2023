import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { NPCExperience } from "@providers/npc/NPCExperience/NPCExperience";
import { NPCTarget } from "@providers/npc/movement/NPCTarget";
import { QuestSystem } from "@providers/quest/QuestSystem";
import { NewRelicMetricCategory, NewRelicSubCategory } from "@providers/types/NewRelicTypes";
import { EntityType, QuestType } from "@rpg-engine/shared";
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
    private questSystem: QuestSystem,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting,
    private npcExperience: NPCExperience,
    private newRelic: NewRelic
  ) {}

  @TrackNewRelicTransaction()
  public async handleDeathAfterHit(attacker: ICharacter | INPC, target: ICharacter | INPC): Promise<void> {
    if (!target.isAlive) {
      await this.battleEffects.generateBloodOnGround(target);

      if (target.type === "Character") {
        await this.handleCharacterDeath(attacker, target as ICharacter);

        if (attacker.type === EntityType.Character) {
          this.newRelic.trackMetric(NewRelicMetricCategory.Count, NewRelicSubCategory.Characters, "PVP/Death", 1);
        }
        if (attacker.type === EntityType.NPC) {
          this.newRelic.trackMetric(NewRelicMetricCategory.Count, NewRelicSubCategory.Characters, "Mob/Death", 1);
        }
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

    if (attacker.type === "Character") {
      await this.questSystem.updateQuests(QuestType.Kill, attacker as ICharacter, targetNPC.key);
      await this.battleNetworkStopTargeting.stopTargeting(attacker as ICharacter);
    }
  }
}
