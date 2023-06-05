import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { ENTITY_EFFECT_DAMAGE_LEVEL_MULTIPLIER } from "@providers/constants/EntityEffectsConstants";
import { container } from "@providers/inversify/container";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { BasicAttribute } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

interface ICalculateDamageOptions {
  maxBonusDamage?: number;
  finalBonusDamage?: number;
}

@provide(CalculateEffectDamage)
export class CalculateEffectDamage {
  public async calculateEffectDamage(
    attacker: ICharacter | INPC,
    target: ICharacter | INPC,
    options?: ICalculateDamageOptions
  ): Promise<number> {
    const MIN_DAMAGE = 1;
    const MIN_ATTACKER_LEVEL = 1;
    try {
      const attackerSkills = attacker.skills as ISkill;
      const attackerLevel = attackerSkills?.level ?? MIN_ATTACKER_LEVEL;

      const targetSkill = (await Skill.findOne({ _id: target.skills }).lean()) as ISkill;

      const skillGetter = container.get(TraitGetter);

      const resistanceLevel = await skillGetter.getSkillLevelWithBuffs(targetSkill, BasicAttribute.Resistance);
      const magicResistanceLevel = await skillGetter.getSkillLevelWithBuffs(
        targetSkill,
        BasicAttribute.MagicResistance
      );

      const maxDamage = Math.ceil(
        attackerLevel * ENTITY_EFFECT_DAMAGE_LEVEL_MULTIPLIER + (options?.maxBonusDamage ?? 0)
      );
      const effectDamageRaw = _.random(MIN_DAMAGE, maxDamage);
      const maxDefense = _.random(MIN_DAMAGE, resistanceLevel + magicResistanceLevel);
      const effectDamage = effectDamageRaw - maxDefense + (options?.finalBonusDamage ?? 0);

      return effectDamage < MIN_DAMAGE ? MIN_DAMAGE : effectDamage;
    } catch (err) {
      console.error(err);
      return MIN_DAMAGE;
    }
  }
}
