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
      skillLevelBefore: skills[skillType].level,
      skillLevelAfter: 0,
      skillName: "",
      skillPoints: 0,
    };

    switch (skillType) {
      case "first": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.first, skills[skillType].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillType].level,
          skillName: skillType,
          skillPoints: skills[skillType].skillPoints,
        };

        break;
      }

      case "sword": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.sword, skills[skillType].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillType].level,
          skillName: skillType,
          skillPoints: skills[skillType].skillPoints,
        };

        break;
      }

      case "dagger": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.dagger, skills[skillType].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillType].level,
          skillName: skillType,
          skillPoints: skills[skillType].skillPoints,
        };

        break;
      }

      case "axe": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.axe, skills[skillType].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillType].level,
          skillName: skillType,
          skillPoints: skills[skillType].skillPoints,
        };

        break;
      }

      case "distance": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.distance, skills[skillType].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillType].level,
          skillName: skillType,
          skillPoints: skills[skillType].skillPoints,
        };

        break;
      }

      case "shielding": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.distance, skills[skillType].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillType].level,
          skillName: skillType,
          skillPoints: skills[skillType].skillPoints,
        };

        break;
      }

      case "club": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.distance, skills[skillType].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillType].level,
          skillName: skillType,
          skillPoints: skills[skillType].skillPoints,
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
