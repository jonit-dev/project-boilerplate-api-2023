import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { SkillFunctions } from "@providers/skill/SkillFunctions";
import { ICombatSkillsBonusAndPenalties, IIncreaseSPResult } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterCombatBonusPenalties)
export class CharacterCombatBonusPenalties {
  constructor(private skillFunctions: SkillFunctions) {}

  public async updateCombatSkills(
    skills: ISkill,
    skillType: string,
    bonusOrPenalties: ICombatSkillsBonusAndPenalties
  ): Promise<IIncreaseSPResult> {
    let skillLevelUp: boolean = false;
    let skillSpData: IIncreaseSPResult = {
      skillLevelUp: false,
      skillLevel: 0,
      skillName: "",
      skillPoints: 0,
    };

    const skillTypeLowerCase = skillType.toLowerCase();

    switch (skillTypeLowerCase) {
      case "none": {
        const firstType = "first";
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.first)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[firstType].level,
          skillName: skillType,
          skillPoints: skills[firstType].skillPoints,
        };

        break;
      }

      case "sword": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.sword)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skillTypeLowerCase].level,
          skillName: skillType,
          skillPoints: skills[skillTypeLowerCase].skillPoints,
        };

        break;
      }

      case "dagger": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.dagger)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skillTypeLowerCase].level,
          skillName: skillTypeLowerCase,
          skillPoints: skills[skillTypeLowerCase].skillPoints,
        };

        break;
      }

      case "axe": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.axe)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skillTypeLowerCase].level,
          skillName: skillType,
          skillPoints: skills[skillTypeLowerCase].skillPoints,
        };

        break;
      }

      case "ranged": {
        const rangedType = "distance";
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.distance)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[rangedType].level,
          skillName: skillType,
          skillPoints: skills[rangedType].skillPoints,
        };

        break;
      }

      case "spear": {
        const rangedType = "distance";
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.distance)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[rangedType].level,
          skillName: skillType,
          skillPoints: skills[rangedType].skillPoints,
        };

        break;
      }

      case "shield": {
        const shieldType = "shielding";
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.shielding)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[shieldType].level,
          skillName: skillType,
          skillPoints: skills[shieldType].skillPoints,
        };

        break;
      }

      case "mace": {
        const maceType = "club";
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.club)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[maceType].level,
          skillName: skillType,
          skillPoints: skills[maceType].skillPoints,
        };

        break;
      }

      default:
        break;
    }

    const character = (await Character.findById(skills.owner)) as ICharacter;

    await this.skillFunctions.updateSkills(skills, character);

    return skillSpData;
  }
}
