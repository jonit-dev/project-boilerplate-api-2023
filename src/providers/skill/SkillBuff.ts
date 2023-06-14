import { CharacterBuff } from "@entities/ModuleCharacter/CharacterBuffModel";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterBuffType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { clearCacheForKey } from "speedgoose";
import { SkillsAvailable } from "./SkillTypes";
import { TraitGetter } from "./TraitGetter";

@provide(SkillBuff)
export class SkillBuff {
  constructor(private traitGetter: TraitGetter) {}

  public async getSkillsWithBuff(character: ICharacter): Promise<ISkill> {
    const skills = (await Skill.findById(character.skills)
      .lean({ virtuals: true, defaults: true })
      .cacheQuery({
        cacheKey: `${character._id}-skills`,
      })) as ISkill;

    if (!skills) {
      throw new Error("Skills not found for character ", character._id.toString());
    }

    if (skills.ownerType === "Character") {
      const buffedSkills = await CharacterBuff.find({
        owner: skills.owner,
        type: CharacterBuffType.Skill,
      })
        .lean({
          virtuals: true,
          default: true,
        })
        .cacheQuery({
          cacheKey: `characterBuffs_${skills.owner?.toString()}`,
        });

      const buffedSkillsList = buffedSkills.map((buff) => buff.trait);

      for (const skillName of buffedSkillsList) {
        if (!skills?.[skillName]?.level) {
          console.log(`Skill not found for character ${character._id} trait ${skillName}`);
          await clearCacheForKey(`characterBuffs_${skills.owner?.toString()}`);
          await clearCacheForKey(`${character._id}-skills`);
          continue;
        }

        skills[skillName].level = await this.traitGetter.getSkillLevelWithBuffs(skills, skillName as SkillsAvailable);
      }
    }

    return skills;
  }
}
