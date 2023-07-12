import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { LinearInterpolation } from "@providers/math/LinearInterpolation";
import { CharacterTrait, ISkill } from "@rpg-engine/shared";
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

@provide(SpellCalculator)
export class SpellCalculator {
  constructor(private linearInterpolation: LinearInterpolation) {}

  public async getQuantityBasedOnSkillLevel(
    character: ICharacter,
    skillName: CharacterTrait,
    options?: IOptions
  ): Promise<number> {
    const skillLevel = await this.getSkillLevel(character, skillName);

    let itemsToCreate = round(random(1, skillLevel / options?.difficulty! ?? 3));

    if (options?.max && itemsToCreate > options.max) {
      itemsToCreate = options.max;
    }

    if (options?.min && itemsToCreate < options.min) {
      itemsToCreate = options.min;
    }

    return itemsToCreate;
  }

  public async calculateBasedOnSkillLevel(
    character: ICharacter,
    skillName: CharacterTrait,
    options: IRequiredOptions
  ): Promise<number> {
    const value = await this.getSkillLevel(character, skillName);

    return this.linearInterpolation.calculateLinearInterpolation(
      value,
      options.min,
      options.max,
      options.skillAssociation
    );
  }

  public async getSkillLevel(character: ICharacter, skillName: string): Promise<number> {
    const skills = (await Skill.findOne({ _id: character.skills }).lean()) as unknown as ISkill;
    const skillLevel = skills[skillName].level as number;

    return skillLevel;
  }
}
