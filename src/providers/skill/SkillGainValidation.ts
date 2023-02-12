import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { CUSTOM_SKILL_COOLDOWNS, SP_INCREASE_SECONDS_COOLDOWN } from "@providers/constants/SkillConstants";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";

@provide(SkillGainValidation)
export class SkillGainValidation {
  public canUpdateSkills(attackerSkills: ISkill, skillName: string): boolean {
    const skill = attackerSkills[skillName];

    const lastSkillGain = skill.lastSkillGain || new Date();

    // check if 1 min has passed since last skill gain (use dayjs)

    const now = dayjs();
    const lastSkillGainDate = dayjs(lastSkillGain);

    const diff = now.diff(lastSkillGainDate, "seconds");

    if (diff <= (CUSTOM_SKILL_COOLDOWNS?.[skillName] || SP_INCREASE_SECONDS_COOLDOWN)) {
      return false;
    }

    //! removing this line will cause basic attributes to not update lastSkillGain! I know its not ideal, but it works. I guess its getting overwritten by the updateSkills method on SkillIncrease, but I couldn't manage to fix the bug.
    skill.lastSkillGain = new Date();

    return true;
  }
}
