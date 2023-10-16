import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import {
  SPELL_CALCULATOR_DEFAULT_MAX_SKILL_MULTIPLIER,
  SPELL_CALCULATOR_DEFAULT_MIN_SKILL_MULTIPLIER,
} from "@providers/constants/SkillConstants";
import { LinearInterpolation } from "@providers/math/LinearInterpolation";
import { SkillsAvailable } from "@providers/skill/SkillTypes";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { provide } from "inversify-binding-decorators";
import { random, round } from "lodash";

interface IOptions {
  max?: number;
  min?: number;
  difficulty?: 2 | 3 | 4 | 5 | 6;
}

export interface IRequiredOptions {
  max: number;
  min: number;
  skillAssociation?: "default" | "reverse"; // reverse = higher skill, lower the value. default = higher skill, higher the value
}

const DEFAULT_MIN_LEVEL_MULTIPLIER = 0.2;
const DEFAULT_MAX_LEVEL_MULTIPLIER = 0.8;

interface ISpellDamageOptions {
  level?: boolean;
  minLevelMultiplier?: number;
  maxLevelMultiplier?: number;
}

@provide(SpellCalculator)
export class SpellCalculator {
  constructor(private linearInterpolation: LinearInterpolation, private traitGetter: TraitGetter) {}

  @TrackNewRelicTransaction()
  public async getQuantityBasedOnSkillLevel(
    character: ICharacter,
    skillName: SkillsAvailable,
    options?: IOptions
  ): Promise<number> {
    const skills = await this.getCharacterSkill(character);

    const skillLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, skillName);

    let itemsToCreate = round(random(1, skillLevel / options?.difficulty! ?? 3));

    if (options?.max && itemsToCreate > options.max) {
      itemsToCreate = options.max;
    }

    if (options?.min && itemsToCreate < options.min) {
      itemsToCreate = options.min;
    }

    return itemsToCreate;
  }

  @TrackNewRelicTransaction()
  public async calculateBasedOnSkillLevel(
    character: ICharacter,
    skillName: SkillsAvailable,
    options: IRequiredOptions
  ): Promise<number> {
    const skills = await this.getCharacterSkill(character);

    const skillLevel = await this.traitGetter.getSkillLevelWithBuffs(skills, skillName);

    const buffPercentage = await this.linearInterpolation.calculateLinearInterpolation(
      skillLevel,
      options.min,
      options.max,
      options.skillAssociation
    );

    // Verificar se o valor interpolado é maior que o valor máximo (max).
    // Se for maior, definir o valor interpolado como o valor máximo (max).
    const maxInterpolatedValue = Math.min(buffPercentage, options.max);

    return maxInterpolatedValue;
  }

  @TrackNewRelicTransaction()
  public async spellDamageCalculator(
    character: ICharacter,
    skillName: SkillsAvailable,
    options?: {
      minSkillMultiplier?: number;
      maxSkillMultiplier?: number;
      level?: boolean;
      minLevelMultiplier?: number;
      maxLevelMultiplier?: number;
      bonusDamage?: boolean;
    }
  ): Promise<number> {
    const { bonusDamage = false } = options || {};

    const minSkillMultiplier = options?.minSkillMultiplier || SPELL_CALCULATOR_DEFAULT_MIN_SKILL_MULTIPLIER;
    const maxSkillMultiplier = options?.maxSkillMultiplier || SPELL_CALCULATOR_DEFAULT_MAX_SKILL_MULTIPLIER;

    const skillLevel = await this.getSkillLevel(character, skillName);
    let [minTotalValue, maxTotalValue] = this.calculateSkillDamage(skillLevel, minSkillMultiplier, maxSkillMultiplier);

    if (options?.level) {
      const [minLevelValue, maxLevelValue] = await this.calculateLevelDamage(character, options);
      minTotalValue += minLevelValue;
      maxTotalValue += maxLevelValue;
    }

    if (minTotalValue < 1) {
      throw new Error("The minimum value cannot be less than 1.");
    }

    let damage = this.generateRandomDamage(minTotalValue, maxTotalValue);

    if (!bonusDamage) {
      damage /= 2.5;
    }

    return damage;
  }

  private async getSkillLevel(character: ICharacter, skillName: SkillsAvailable): Promise<number> {
    const skills = await this.getCharacterSkill(character);
    return await this.traitGetter.getSkillLevelWithBuffs(skills, skillName);
  }

  private calculateSkillDamage(skillLevel: number, minMultiplier: number, maxMultiplier: number): [number, number] {
    return [skillLevel * minMultiplier, skillLevel * maxMultiplier];
  }

  private async calculateLevelDamage(character: ICharacter, options: ISpellDamageOptions): Promise<[number, number]> {
    const level = await this.getCharacterLevel(character);
    const minMultiplier = options.minLevelMultiplier || DEFAULT_MIN_LEVEL_MULTIPLIER;
    const maxMultiplier = options.maxLevelMultiplier || DEFAULT_MAX_LEVEL_MULTIPLIER;
    return [level * minMultiplier, level * maxMultiplier];
  }

  private generateRandomDamage(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private async getCharacterLevel(character: ICharacter): Promise<number> {
    const skills = (await Skill.findOne({ _id: character.skills }).lean()) as unknown as ISkill;
    const characterLevel = skills.level as number;

    return characterLevel;
  }

  @TrackNewRelicTransaction()
  public async getCharacterSkill(character: ICharacter): Promise<ISkill> {
    const skills = (await Skill.findOne({ _id: character.skills })
      .lean({
        virtuals: true,
        defaults: true,
      })
      .cacheQuery({
        cacheKey: `${character._id}-skills`,
      })) as unknown as ISkill;

    return skills;
  }
}
