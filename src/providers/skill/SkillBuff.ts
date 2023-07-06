import { CharacterBuff } from "@entities/ModuleCharacter/CharacterBuffModel";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterBuffType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { SkillsAvailable } from "./SkillTypes";
import { TraitGetter } from "./TraitGetter";

@provide(SkillBuff)
export class SkillBuff {
  constructor(private traitGetter: TraitGetter) {}

  @TrackNewRelicTransaction()
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
          defaults: true,
        })
        .cacheQuery({
          cacheKey: `characterBuffs_${skills.owner?.toString()}`,
        });

      for (const buff of buffedSkills) {
        if (buff.type !== CharacterBuffType.Skill) {
          continue;
        }

        if (!skills?.[buff.trait]?.level) {
          console.log(`Skill not found for character ${character._id} trait ${buff.trait}`);
          continue;
        }

        skills[buff.trait].level = await this.traitGetter.getSkillLevelWithBuffs(skills, buff.trait as SkillsAvailable);
      }
    }

    return skills;
  }
}
