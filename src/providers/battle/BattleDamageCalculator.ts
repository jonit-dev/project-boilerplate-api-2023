import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackClassExecutionTime } from "@jonit-dev/decorators-utils";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import {
  BATTLE_CRITICAL_HIT_CHANCE,
  BATTLE_CRITICAL_HIT_DAMAGE_MULTIPLIER,
  BATTLE_TOTAL_POTENTIAL_DAMAGE_MODIFIER,
  DAMAGE_REDUCTION_MAX_REDUCTION_PERCENTAGE,
  DAMAGE_REDUCTION_MIN_DAMAGE,
} from "@providers/constants/BattleConstants";
import { PVP_ROGUE_ATTACK_DAMAGE_INCREASE_MULTIPLIER } from "@providers/constants/PVPConstants";
import { SkillStatsCalculator } from "@providers/skill/SkillsStatsCalculator";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { BasicAttribute, CharacterClass, CombatSkill, EntityType, SKILLS_MAP } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { BattleParticipant } from "./BattleEvent";

@TrackClassExecutionTime()
@provide(BattleDamageCalculator)
export class BattleDamageCalculator {
  constructor(
    private skillStatsCalculator: SkillStatsCalculator,
    private characterWeapon: CharacterWeapon,
    private traitGetter: TraitGetter
  ) {}

  @TrackNewRelicTransaction()
  public async calculateHitDamage(
    attacker: BattleParticipant,
    target: BattleParticipant,
    isMagicAttack: boolean = false
  ): Promise<number> {
    let attackerSkills = attacker.skills as unknown as ISkill;
    let defenderSkills = target.skills as unknown as ISkill;

    if (!attackerSkills?.level) {
      attackerSkills = (await this.getSkills(attacker.id)) as unknown as ISkill;
    }
    if (!defenderSkills?.level) {
      defenderSkills = (await this.getSkills(target.id)) as unknown as ISkill;
    }

    const weapon = await this.characterWeapon.getWeapon(attacker as ICharacter);

    let totalPotentialAttackerDamage = await this.calculateTotalPotentialDamage(
      attackerSkills,
      defenderSkills,
      isMagicAttack,
      weapon?.item
    );

    if (attacker.type === EntityType.Character && target.type === EntityType.Character) {
      totalPotentialAttackerDamage += this.calculateExtraDamageBasedOnClass(
        attacker.class as CharacterClass,
        totalPotentialAttackerDamage
      );
    }

    let damage;

    if (weapon?.item && weapon?.item.isTraining) {
      damage = Math.round(_.random(0, 1));
    } else {
      // regular damage

      const meanDamage = totalPotentialAttackerDamage * 0.75; // 75% of max as the mean
      const stdDeviation = totalPotentialAttackerDamage * 0.1; // 10% of max as the std deviation

      damage = Math.round(this.gaussianRandom(meanDamage, stdDeviation));
    }

    damage = await this.implementDamageReduction(defenderSkills, target, damage, isMagicAttack);

    // damage cannot be higher than target's remaining health
    return damage > target.health ? target.health : damage;
  }

  public getCriticalHitDamageIfSucceed(damage: number): number {
    const hasCriticalHitSucceeded = _.random(0, 100) <= BATTLE_CRITICAL_HIT_CHANCE;

    if (hasCriticalHitSucceeded) return damage * BATTLE_CRITICAL_HIT_DAMAGE_MULTIPLIER;

    return damage;
  }

  private async getSkills(entityId: string): Promise<ISkill> {
    const skills = (await Skill.findOne({
      owner: entityId,
    })
      .lean({ virtuals: true, defaults: true })
      .cacheQuery({
        cacheKey: `${entityId}-skills`,
      })) as unknown as ISkill;

    return skills;
  }

  private gaussianRandom(mean: number, stdDeviation: number): number {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * stdDeviation + mean;
  }

  private async implementDamageReduction(
    defenderSkills: ISkill,
    target: ICharacter | INPC,
    damage: number,
    isMagicAttack: boolean
  ): Promise<number> {
    //! Disable for now NPC damage reduction
    // if (target.type === EntityType.NPC) {
    //   const [defenderResistanceLevel, defenderMagicResistanceLevel] = await Promise.all([
    //     defenderSkills?.resistance.level,
    //     defenderSkills?.magicResistance.level,
    //   ]);

    //   const defenseAttribute = isMagicAttack ? defenderMagicResistanceLevel : defenderResistanceLevel;
    //   damage = this.calculateDamageReduction(
    //     damage,
    //     this.calculateCharacterRegularDefense(defenderSkills.level, defenseAttribute)
    //   );
    // }

    if (target.type === EntityType.Character) {
      const character = target as ICharacter;
      // added this check because was getting
      // 'Skills owner is undefined' in the getSkillLevelWithBuffs function
      if (!defenderSkills.owner) {
        defenderSkills.owner = target.id;
      }

      const [hasShield, defenderShieldingLevel, defenderResistanceLevel, defenderMagicResistanceLevel] =
        await Promise.all([
          this.characterWeapon.hasShield(character),
          this.traitGetter.getSkillLevelWithBuffs(defenderSkills, CombatSkill.Shielding),
          this.traitGetter.getSkillLevelWithBuffs(defenderSkills, BasicAttribute.Resistance),
          this.traitGetter.getSkillLevelWithBuffs(defenderSkills, BasicAttribute.MagicResistance),
        ]);

      let DEFENDER_LEVEL_MODIFIER;

      switch (target.class) {
        case CharacterClass.Druid:
        case CharacterClass.Sorcerer:
          DEFENDER_LEVEL_MODIFIER = 0;
          break;
        case CharacterClass.Hunter:
          DEFENDER_LEVEL_MODIFIER = 0.5;
          break;
        default:
          DEFENDER_LEVEL_MODIFIER = 1;
          break;
      }

      const level = defenderSkills.level * DEFENDER_LEVEL_MODIFIER;

      if (hasShield && defenderShieldingLevel > 1) {
        damage = this.calculateDamageReduction(
          damage,
          this.calculateCharacterShieldingDefense(level, defenderResistanceLevel, defenderShieldingLevel)
        );
      } else if (!hasShield) {
        const defenseAttribute = isMagicAttack ? defenderMagicResistanceLevel : defenderResistanceLevel;
        damage = this.calculateDamageReduction(damage, this.calculateCharacterRegularDefense(level, defenseAttribute));
      }
    }

    return damage;
  }

  private async calculateTotalPotentialDamage(
    attackerSkills: ISkill,
    defenderSkills: ISkill,
    isMagicAttack: boolean,
    weapon: IItem | undefined
  ): Promise<number> {
    let attackerTotalAttack, defenderTotalDefense;

    if (isMagicAttack) {
      [attackerTotalAttack, defenderTotalDefense] = await Promise.all([
        this.skillStatsCalculator.getMagicAttack(attackerSkills),
        this.skillStatsCalculator.getMagicDefense(defenderSkills),
      ]);
    } else {
      const extraDamage = this.calculateExtraDamageBasedOnSkills(weapon, attackerSkills);
      [attackerTotalAttack, defenderTotalDefense] = await Promise.all([
        this.skillStatsCalculator.getAttack(attackerSkills),
        this.skillStatsCalculator.getDefense(defenderSkills),
      ]);
      attackerTotalAttack += extraDamage;
    }

    return _.round(attackerTotalAttack * (100 / (100 + defenderTotalDefense))) * BATTLE_TOTAL_POTENTIAL_DAMAGE_MODIFIER;
  }

  private calculateCharacterShieldingDefense(level: number, resistanceLevel: number, shieldingLevel: number): number {
    return this.calculateCharacterRegularDefense(level, resistanceLevel) + Math.floor(shieldingLevel / 2);
  }

  private calculateCharacterRegularDefense(level: number, resistanceLevel: number): number {
    return resistanceLevel + level;
  }

  private calculateDamageReduction(damage: number, characterDefense: number): number {
    const reduction = Math.min(characterDefense / 100, DAMAGE_REDUCTION_MAX_REDUCTION_PERCENTAGE);
    const realDamage = damage * (1 - reduction);

    return Math.max(DAMAGE_REDUCTION_MIN_DAMAGE, realDamage);
  }

  private calculateExtraDamageBasedOnSkills(weapon: IItem | undefined, characterSkills: ISkill): number {
    const weaponSubType = weapon ? weapon.subType || "None" : "None";
    const skillName = SKILLS_MAP.get(weaponSubType);
    if (!skillName) {
      return 0;
    }
    return Math.floor(characterSkills[skillName].level / 2);
  }

  private calculateExtraDamageBasedOnClass(clas: CharacterClass, calculatedDamage: number): number {
    if (clas === CharacterClass.Rogue) {
      return Math.floor(calculatedDamage * PVP_ROGUE_ATTACK_DAMAGE_INCREASE_MULTIPLIER);
    }
    return 0;
  }
}
