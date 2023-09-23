import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { CUSTOM_SKILL_INCREASE_TIMEOUT, SP_INCREASE_SECONDS_TIMEOUT } from "@providers/constants/SkillConstants";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";

@provide(SkillGainValidation)
export class SkillGainValidation {
  constructor(private characterValidation: CharacterValidation) {}

  public canUpdateSkills(character: ICharacter, attackerSkills: ISkill, skillName: string): boolean {
    const hasBasicValidation = this.characterValidation.hasBasicValidation(character);

    if (!hasBasicValidation) {
      return false;
    }

    const skill = attackerSkills[skillName];

    const lastSkillGain = skill.lastSkillGain || new Date();

    // check if 1 min has passed since last skill gain (use dayjs)

    const now = dayjs();
    const lastSkillGainDate = dayjs(lastSkillGain);

    const diff = now.diff(lastSkillGainDate, "seconds");

    if (diff <= (CUSTOM_SKILL_INCREASE_TIMEOUT?.[skillName] || SP_INCREASE_SECONDS_TIMEOUT)) {
      return false;
    }

    //! removing this line will cause basic attributes to not update lastSkillGain! I know its not ideal, but it works. I guess its getting overwritten by the updateSkills method on SkillIncrease, but I couldn't manage to fix the bug.
    skill.lastSkillGain = new Date();

    return true;
  }
}
