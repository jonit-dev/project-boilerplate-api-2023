import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { SkillFunctions } from "@providers/skill/SkillFunctions";
import { CharacterRepository } from "@repositories/ModuleCharacter/CharacterRepository";
import { ICombatSkillsBonusAndPenalties, IIncreaseSPResult } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterCombatBonusPenalties)
export class CharacterCombatBonusPenalties {
  constructor(private skillFunctions: SkillFunctions, private characterRepository: CharacterRepository) {}

  public async updateCombatSkills(
    character: ICharacter,
    skills: ISkill,
    skillName: string,
    bonusOrPenalties: ICombatSkillsBonusAndPenalties
  ): Promise<IIncreaseSPResult> {
    let skillLevelUp: boolean = false;

    let skillSpData: IIncreaseSPResult = {
      skillLevelUp: false,
      skillLevelBefore: skills[skillName].level,
      skillLevelAfter: 0,
      skillName: "",
      skillPoints: 0,
    };

    switch (skillName) {
      case "first": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillName,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.first, skills[skillName].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillName].level,
          skillName: skillName,
          skillPoints: skills[skillName].skillPoints,
        };

        break;
      }

      case "sword": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillName,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.sword, skills[skillName].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillName].level,
          skillName: skillName,
          skillPoints: skills[skillName].skillPoints,
        };

        break;
      }

      case "dagger": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillName,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.dagger, skills[skillName].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillName].level,
          skillName: skillName,
          skillPoints: skills[skillName].skillPoints,
        };

        break;
      }

      case "axe": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillName,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.axe, skills[skillName].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillName].level,
          skillName: skillName,
          skillPoints: skills[skillName].skillPoints,
        };

        break;
      }

      case "distance": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillName,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.distance, skills[skillName].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillName].level,
          skillName: skillName,
          skillPoints: skills[skillName].skillPoints,
        };

        break;
      }

      case "shielding": {
        skillLevelUp = await this.skillFunctions.updateSkillByType(
          skills,
          skillName,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.distance, skills[skillName].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillName].level,
          skillName: skillName,
          skillPoints: skills[skillName].skillPoints,
        };

        break;
      }

      case "club": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillName,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.distance, skills[skillName].level)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillName].level,
          skillName: skillName,
          skillPoints: skills[skillName].skillPoints,
        };

        break;
      }

      default:
        break;
    }

    if (!skills.owner) {
      throw new Error("Skill owner not found");
    }

    const char = (await this.characterRepository.findById(skills.owner.toString())) as ICharacter;

    await this.skillFunctions.updateSkills(skills, char);

    return skillSpData;
  }
}
