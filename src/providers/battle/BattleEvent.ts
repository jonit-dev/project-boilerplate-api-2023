import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackClassExecutionTime } from "@jonit-dev/decorators-utils";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import {
  BATTLE_BLOCK_CHANCE_MULTIPLIER,
  BATTLE_HIT_CHANCE_MULTIPLIER,
  BATTLE_MINIMUM_HIT_CHANCE,
} from "@providers/constants/BattleConstants";
import { SkillStatsCalculator } from "@providers/skill/SkillsStatsCalculator";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { BasicAttribute, BattleEventType, EntityAttackType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

export type BattleParticipant = ICharacter | INPC;

@TrackClassExecutionTime()
@provide(BattleEvent)
export class BattleEvent {
  constructor(
    private skillStatsCalculator: SkillStatsCalculator,
    private characterWeapon: CharacterWeapon,
    private traitGetter: TraitGetter
  ) {}

  @TrackNewRelicTransaction()
  public async calculateEvent(attacker: BattleParticipant, target: BattleParticipant): Promise<BattleEventType> {
    const attackerSkills = attacker.skills as unknown as ISkill;
    const defenderSkills = target.skills as unknown as ISkill;

    // Fetch the required data in parallel
    const [defenderDefense, attackerAttack, attackerDexterityLevel, defenderDexterityLevel] = await Promise.all([
      this.skillStatsCalculator.getDefense(defenderSkills),
      this.skillStatsCalculator.getAttack(attackerSkills),
      this.traitGetter.getSkillLevelWithBuffs(attackerSkills, BasicAttribute.Dexterity),
      this.traitGetter.getSkillLevelWithBuffs(defenderSkills, BasicAttribute.Dexterity),
    ]);

    const defenderModifiers = defenderDefense + defenderDexterityLevel;
    const attackerModifiers = attackerAttack + attackerDexterityLevel;

    const hasHitSucceeded = await this.hasBattleEventSucceeded(
      attacker as ICharacter,
      attackerModifiers,
      defenderModifiers,
      "attack"
    );

    if (!hasHitSucceeded) {
      return BattleEventType.Miss;
    }

    const hasBlockSucceeded = await this.hasBattleEventSucceeded(
      target as ICharacter,
      defenderModifiers,
      attackerModifiers,
      "defense"
    );

    if (hasBlockSucceeded) {
      return BattleEventType.Block;
    }

    return BattleEventType.Hit;
  }

  private async hasBattleEventSucceeded(
    character: ICharacter,
    actionModifier: number,
    oppositeActionModifier: number,
    type: "attack" | "defense"
  ): Promise<boolean> {
    let lowerBound = 0;
    let chanceMultiplier = 1;

    if (type === "attack") {
      const attackType = await this.characterWeapon.getAttackType(character);
      if (!attackType) {
        return false;
      }

      actionModifier = this.calculateActionModifier(attackType, actionModifier);
      lowerBound = BATTLE_MINIMUM_HIT_CHANCE;
      chanceMultiplier = BATTLE_HIT_CHANCE_MULTIPLIER;
    } else if (type === "defense") {
      chanceMultiplier = BATTLE_BLOCK_CHANCE_MULTIPLIER;
    }

    const chance = Math.max(
      lowerBound,
      (actionModifier / (oppositeActionModifier + actionModifier)) * 100 * chanceMultiplier
    );

    const n = _.random(0, 100);

    return n <= chance;
  }

  private calculateActionModifier(attackType: EntityAttackType, actionModifier: number): number {
    // make it easier to hit when you're ranged
    if (attackType === EntityAttackType.Ranged) {
      actionModifier *= 2;
    }
    return actionModifier;
  }
}
