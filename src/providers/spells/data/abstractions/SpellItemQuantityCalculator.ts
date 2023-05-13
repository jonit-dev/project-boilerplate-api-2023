import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { random, round } from "lodash";

interface ISkillItemQtyOptions {
  max?: number;
  min?: number;
  difficulty?: 2 | 3 | 4 | 5 | 6;
}

@provide(SpellItemQuantityCalculator)
export class SpellItemQuantityCalculator {
  public async getQuantityBasedOnSkillLevel(
    character: ICharacter,
    skillName: string,
    options?: ISkillItemQtyOptions
  ): Promise<number> {
    const characterWithSkills = await character.populate("skills").execPopulate();
    const skills = characterWithSkills.skills as unknown as ISkill;
    const skillLevel = skills[skillName].level as number;

    let itemsToCreate = round(random(1, skillLevel / options?.difficulty! ?? 3));

    if (options?.max && itemsToCreate > options.max) {
      itemsToCreate = options.max;
    }

    if (options?.min && itemsToCreate < options.min) {
      itemsToCreate = options.min;
    }

    return itemsToCreate;
  }
}
