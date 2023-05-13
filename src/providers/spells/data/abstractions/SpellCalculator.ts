import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterTrait, ISkill } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { random, round } from "lodash";

interface IOptions {
  max?: number;
  min?: number;
  difficulty?: 2 | 3 | 4 | 5 | 6;
}

interface IRequiredOptions {
  max: number;
  min: number;
  skillAssociation?: "default" | "reverse"; // reverse = higher skill, lower the value. default = higher skill, higher the value
}

@provide(SpellCalculator)
export class SpellCalculator {
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

  public async calculateBuffBasedOnSkillLevel(
    character: ICharacter,
    skillName: CharacterTrait,
    options: IRequiredOptions
  ): Promise<number> {
    return await this.calculateLinearInterpolation(
      character,
      skillName,
      options.min,
      options.max,
      options.skillAssociation
    );
  }

  public async calculateTimeoutBasedOnSkillLevel(
    character: ICharacter,
    skillName: CharacterTrait,
    options: IRequiredOptions
  ): Promise<number> {
    return await this.calculateLinearInterpolation(
      character,
      skillName,
      options.min,
      options.max,
      options.skillAssociation
    );
  }

  private async calculateLinearInterpolation(
    character: ICharacter,
    skillName: CharacterTrait,
    min: number,
    max: number,
    skillAssociation: "default" | "reverse" = "default"
  ): Promise<number> {
    const skillLevel = await this.getSkillLevel(character, skillName);

    let value;
    if (skillAssociation === "default") {
      // Linear interpolation formula for default skill association (higher skill, higher the value)
      value = min + ((max - min) * (skillLevel - 1)) / 99;
    } else {
      // Linear interpolation formula for reverse skill association (higher skill, lower the value)
      value = max - ((max - min) * (skillLevel - 1)) / 99;
    }

    return round(value);
  }

  private async getSkillLevel(character: ICharacter, skillName: string): Promise<number> {
    const skills = (await Skill.findOne({ _id: character.skills }).lean()) as unknown as ISkill;
    const skillLevel = skills[skillName].level as number;

    return skillLevel;
  }
}
