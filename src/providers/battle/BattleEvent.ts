import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import {
  BATTLE_BLOCK_CHANCE_MULTIPLIER,
  BATTLE_CRITICAL_HIT_CHANCE,
  BATTLE_CRITICAL_HIT_DAMAGE_MULTIPLIER,
  BATTLE_HIT_CHANCE_MULTIPLIER,
  BATTLE_MINIMUM_HIT_CHANCE,
} from "@providers/constants/BattleConstants";
import { PVP_ROGUE_ATTACK_DAMAGE_INCREASE_MULTIPLIER } from "@providers/constants/PVPConstants";
import { SkillStatsCalculator } from "@providers/skill/SkillsStatsCalculator";
import { TraitGetter } from "@providers/skill/TraitGetter";
import {
  BasicAttribute,
  BattleEventType,
  CharacterClass,
  CombatSkill,
  EntityAttackType,
  EntityType,
  SKILLS_MAP,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

type BattleParticipant = ICharacter | INPC;

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
    console.log(target.skills);
    const defenderDefense = await this.skillStatsCalculator.getDefense(defenderSkills);
    const attackerAttack = await this.skillStatsCalculator.getAttack(attackerSkills);

    const attackerDexterityLevel = await this.traitGetter.getSkillLevelWithBuffs(
      attackerSkills,
      BasicAttribute.Dexterity
    );
    const defenderDexterityLevel = await this.traitGetter.getSkillLevelWithBuffs(
      defenderSkills,
      BasicAttribute.Dexterity
    );

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

  @TrackNewRelicTransaction()
  public async calculateHitDamage(
    attacker: BattleParticipant,
    target: BattleParticipant,
    isMagicAttack: boolean = false
  ): Promise<number> {
    const attackerSkills = attacker.skills as unknown as ISkill;
    const defenderSkills = target.skills as unknown as ISkill;

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

    let damage =
      weapon?.item && weapon?.item.isTraining
        ? Math.round(_.random(0, 1))
        : Math.round(_.random(totalPotentialAttackerDamage / 3, totalPotentialAttackerDamage));

    damage = await this.implementDamageReduction(defenderSkills, target, damage, isMagicAttack);

    // damage cannot be higher than target's remaining health
    return damage > target.health ? target.health : damage;
  }

  public getCriticalHitDamageIfSucceed(damage: number): number {
    const hasCriticalHitSucceeded = _.random(0, 100) <= BATTLE_CRITICAL_HIT_CHANCE;

    if (hasCriticalHitSucceeded) return damage * BATTLE_CRITICAL_HIT_DAMAGE_MULTIPLIER;

    return damage;
  }

  private async implementDamageReduction(
    defenderSkills: ISkill,
    target: ICharacter | INPC,
    damage: number,
    isMagicAttack: boolean
  ): Promise<number> {
    if (target.type === "Character") {
      const character = target as ICharacter;

      const [hasShield, defenderShieldingLevel, defenderResistanceLevel, defenderMagicResistanceLevel] =
        await Promise.all([
          this.characterWeapon.hasShield(character),
          this.traitGetter.getSkillLevelWithBuffs(defenderSkills, CombatSkill.Shielding),
          this.traitGetter.getSkillLevelWithBuffs(defenderSkills, BasicAttribute.Resistance),
          this.traitGetter.getSkillLevelWithBuffs(defenderSkills, BasicAttribute.MagicResistance),
        ]);

      const DEFENDER_LEVEL_MODIFIER =
        target.class === CharacterClass.Druid ||
        target.class === CharacterClass.Sorcerer ||
        target.class === CharacterClass.Hunter
          ? 0
          : 1;

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

    return _.round(attackerTotalAttack * (100 / (100 + defenderTotalDefense)));
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

  private calculateCharacterShieldingDefense(level: number, resistanceLevel: number, shieldingLevel: number): number {
    return this.calculateCharacterRegularDefense(level, resistanceLevel) + Math.floor(shieldingLevel / 2);
  }

  private calculateCharacterRegularDefense(level: number, resistanceLevel: number): number {
    return resistanceLevel + level;
  }

  private calculateDamageReduction(damage: number, characterDefense: number): number {
    let realDamage = 0;
    realDamage = damage - Math.floor(characterDefense / 5);
    if (realDamage < damage && realDamage > 0) {
      return realDamage;
    }
    return realDamage > 0 ? realDamage : damage;
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
