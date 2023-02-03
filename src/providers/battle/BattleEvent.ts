import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MapControlTimeModel } from "@entities/ModuleSystem/MapControlTimeModel";
import { INCREASE_BONUS_FACTION } from "@providers/constants/SkillConstants";
import { BattleEventType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

type BattleParticipant = ICharacter | INPC;

@provide(BattleEvent)
export class BattleEvent {
  public async calculateEvent(attacker: BattleParticipant, target: BattleParticipant): Promise<BattleEventType> {
    const attackerSkills = attacker.skills as unknown as ISkill;
    const defenderSkills = target.skills as unknown as ISkill;

    const defenderDefense = await defenderSkills.defense;
    const attackerAttack = await attackerSkills.attack;

    const defenderModifiers = defenderDefense + defenderSkills.dexterity.level;
    const attackerModifiers = attackerAttack + attackerSkills.dexterity.level;

    const hasHitSucceeded = this.hasBattleEventSucceeded(attackerModifiers, defenderModifiers);

    if (hasHitSucceeded) {
      return BattleEventType.Hit;
    }

    const hasBlockSucceeded = this.hasBattleEventSucceeded(defenderModifiers, attackerModifiers);

    if (hasBlockSucceeded) {
      return BattleEventType.Block;
    }

    return BattleEventType.Miss;
  }

  private hasBattleEventSucceeded(actionModifier: number, oppositeActionModifier: number): boolean {
    const chance = (actionModifier / (oppositeActionModifier + actionModifier)) * 100;
    const n = _.random(0, 100);

    return n <= chance;
  }

  public async calculateHitDamage(attacker: BattleParticipant, target: BattleParticipant): Promise<number> {
    const attackerSkills = attacker.skills as ISkill;
    const defenderSkills = target.skills as ISkill;
    const attackerTotalAttack = await attackerSkills.attack;
    const defenderTotalDefense = await defenderSkills.defense;
    let totalAttackWithBonus = attackerTotalAttack;
    let totalDefenseWithBonus = defenderTotalDefense;

    const weatherData = await MapControlTimeModel.findOne({}, { period: 1, _id: 0 }).limit(1).lean({ virtuals: true });
    const weatherPeriod = weatherData?.period;
    const isAttackerCharacter = attacker.type === "Character";
    const isTargetCharacter = target.type === "Character";

    if (isAttackerCharacter) {
      const character = attacker as ICharacter;
      if (character.faction === "Life Bringer" && weatherPeriod === "Morning") {
        totalAttackWithBonus += attackerTotalAttack * INCREASE_BONUS_FACTION;
      } else if (character.faction === "Shadow Walker" && weatherPeriod === "Night") {
        totalAttackWithBonus += attackerTotalAttack * INCREASE_BONUS_FACTION;
      }
    }

    if (isTargetCharacter) {
      const character = target as ICharacter;
      if (character.faction === "Life Bringer" && weatherPeriod === "Morning") {
        totalDefenseWithBonus += defenderTotalDefense * INCREASE_BONUS_FACTION;
      } else if (character.faction === "Shadow Walker" && weatherPeriod === "Night") {
        totalDefenseWithBonus += defenderTotalDefense * INCREASE_BONUS_FACTION;
      }
    }

    const totalPotentialAttackerDamage = Math.round(totalAttackWithBonus * (100 / (100 + totalDefenseWithBonus)));
    const damage = Math.round(_.random(0, totalPotentialAttackerDamage));
    return damage > target.health ? target.health : damage;
  }
}
