import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { ENTITY_EFFECT_DAMAGE_LEVEL_MULTIPLIER } from "@providers/constants/EntityEffectsConstants";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { BasicAttribute } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";

interface ICalculateDamageOptions {
  maxBonusDamage?: number;
  finalBonusDamage?: number;
}

@provide(CalculateEffectDamage)
export class CalculateEffectDamage {
  constructor(private skillGetter: TraitGetter) {}

  @TrackNewRelicTransaction()
  public async calculateEffectDamage(
    attacker: ICharacter | INPC,
    target: ICharacter | INPC,
    options?: ICalculateDamageOptions
  ): Promise<number> {
    const minRawDamage = 1;
    const minAttackerLevel = 1;
    try {
      let attackerSkills = attacker.skills as ISkill;

      if (!attackerSkills?.level) {
        attackerSkills = (await Skill.findById(target.skills)
          .lean({
            virtuals: true,
            defaults: true,
          })
          .cacheQuery({
            cacheKey: `${target._id}-skills`,
          })) as ISkill;
      }

      const attackerLevel = attackerSkills?.level ?? minAttackerLevel;

      const targetSkill = (await Skill.findById(target.skills)
        .lean({
          virtuals: true,
          defaults: true,
        })
        .cacheQuery({
          cacheKey: `${target._id}-skills`,
        })) as ISkill;

      const { resistanceLevel, magicResistanceLevel } = await this.getTargetResistances(targetSkill);

      const { attackerMagicLevel, attackerStrengthLevel } = await this.getAttackerMagicStrengthLevel(attackerSkills);

      const effectDamage = this.calculateTotalEffectDamage(
        attackerLevel,
        attackerMagicLevel,
        attackerStrengthLevel,
        minRawDamage,
        resistanceLevel,
        magicResistanceLevel,
        options
      );

      return effectDamage;
    } catch (err) {
      console.error(err);
      return minRawDamage;
    }
  }

  private calculateTotalEffectDamage(
    attackerLevel: number,
    attackerStrengthLevel: number,
    attackerMagicLevel: number,
    minRawDamage: number,
    resistanceLevel: number,
    magicResistanceLevel: number,
    options?: ICalculateDamageOptions
  ): number {
    // Unified approach for calculating maxDamage
    const baseDamage = attackerLevel * ENTITY_EFFECT_DAMAGE_LEVEL_MULTIPLIER;
    const additionalDamage = Math.max(attackerMagicLevel, attackerStrengthLevel);
    const maxDamage = Math.ceil(baseDamage + additionalDamage + (options?.maxBonusDamage ?? 0));

    // Min damage no longer relies on attackerLevel, making it constant
    const minDamage = minRawDamage;

    // Random number between min and max damage for attack and defense
    const effectDamageRaw = random(minDamage, maxDamage);
    const maxDefense = random(minRawDamage, resistanceLevel + magicResistanceLevel);

    // Final effect damage calculation
    const effectDamage = effectDamageRaw - maxDefense + (options?.finalBonusDamage ?? 0);

    return Math.max(effectDamage, minDamage);
  }

  private async getAttackerMagicStrengthLevel(attackerSkills: ISkill): Promise<{
    attackerMagicLevel: number;
    attackerStrengthLevel: number;
  }> {
    const attackerMagicLevel = await this.skillGetter.getSkillLevelWithBuffs(attackerSkills, BasicAttribute.Magic);
    const attackerStrengthLevel = await this.skillGetter.getSkillLevelWithBuffs(
      attackerSkills,
      BasicAttribute.Strength
    );

    return { attackerMagicLevel, attackerStrengthLevel };
  }

  private async getTargetResistances(
    targetSkill: ISkill
  ): Promise<{ resistanceLevel: number; magicResistanceLevel: number }> {
    const resistanceLevel = await this.skillGetter.getSkillLevelWithBuffs(targetSkill, BasicAttribute.Resistance);
    const magicResistanceLevel = await this.skillGetter.getSkillLevelWithBuffs(
      targetSkill,
      BasicAttribute.MagicResistance
    );

    return { resistanceLevel, magicResistanceLevel };
  }
}
