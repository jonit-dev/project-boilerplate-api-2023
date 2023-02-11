import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
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

  public async calculateHitDamage(
    attacker: BattleParticipant,
    target: BattleParticipant,
    isMagicAttack: boolean = false
  ): Promise<number> {
    const attackerSkills = attacker.skills as unknown as ISkill;
    const defenderSkills = target.skills as unknown as ISkill;
    const attackerTotalAttack = isMagicAttack ? await attackerSkills.magicAttack : await attackerSkills.attack;
    const defenderTotalDefense = isMagicAttack ? await attackerSkills.magicDefense : await defenderSkills.defense;

    const totalPotentialAttackerDamage = _.round(attackerTotalAttack * (100 / (100 + defenderTotalDefense)));

    let damage = Math.round(_.random(0, totalPotentialAttackerDamage));

    if (defenderSkills.shielding.level > 1 && target.type === "Character") {
      damage = this.calculateDamageReduction(
        damage,
        this.calculateCharacterDefense(
          defenderSkills.level,
          isMagicAttack ? defenderSkills.magicResistance.level : defenderSkills.resistance.level,
          defenderSkills.shielding.level
        )
      );
    }

    // damage cannot be higher than target's remaining health
    return damage > target.health ? target.health : damage;
  }

  private calculateCharacterDefense(level: number, resistanceLevel: number, shieldLevel: number): number {
    return resistanceLevel + level + Math.floor(shieldLevel / 2);
  }

  private calculateDamageReduction(damage: number, characterDefense: number): number {
    let realDamage = 0;
    realDamage = damage - Math.floor(characterDefense / 5);
    if (realDamage < damage && realDamage > 0) {
      return realDamage;
    }
    return realDamage > 0 ? realDamage : damage;
  }
}
