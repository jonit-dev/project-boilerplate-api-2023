import { CharacterBuff } from "@entities/ModuleCharacter/CharacterBuffModel";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterClassBonusOrPenalties } from "@providers/character/characterBonusPenalties/CharacterClassBonusOrPenalties";
import { CharacterBuffTracker } from "@providers/character/characterBuff/CharacterBuffTracker";
import { CharacterBuffType, CharacterTrait } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(SkillBuff)
export class SkillBuff {
  constructor(
    private characterBuffTracker: CharacterBuffTracker,
    private characterBonusOrPenalties: CharacterClassBonusOrPenalties
  ) {}

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

    const parsedBonusAndPenalties = await this.characterBonusOrPenalties.getClassBonusOrPenaltiesBuffs(character._id);

    // Clone the original skills
    const clonedSkills = _.cloneDeep(skills);

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

        if (!clonedSkills?.[buff.trait]?.level) {
          console.log(`Skill not found for character ${character._id} trait ${buff.trait}`);
          continue;
        }

        clonedSkills[buff.trait].buffAndDebuff = await this.characterBuffTracker.getAllBuffPercentageChanges(
          character._id,
          buff.trait as CharacterTrait
        );
      }

      for (const [key, value] of Object.entries(parsedBonusAndPenalties)) {
        const currentValue = clonedSkills[key].buffAndDebuff;

        if (!clonedSkills[key]) {
          continue;
        }

        // if we have nothing set, just consider the bonus and penalties from class
        if (!clonedSkills[key].buffAndDebuff) {
          clonedSkills[key].buffAndDebuff = value;
        }

        // if we already have something there, just increment with the bonus and penalties from class

        clonedSkills[key].buffAndDebuff = (currentValue ?? 0) + value;

        if (clonedSkills[key].buffAndDebuff === 0) {
          delete clonedSkills[key].buffAndDebuff;
        }
      }
    }

    return clonedSkills;
  }
}
