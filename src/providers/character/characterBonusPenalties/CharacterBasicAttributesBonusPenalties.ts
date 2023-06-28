import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { SkillFunctions } from "@providers/skill/SkillFunctions";
import { IBasicAttributesBonusAndPenalties, IIncreaseSPResult } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterBasicAttributesBonusPenalties)
export class CharacterBasicAttributesBonusPenalties {
  constructor(private skillFunctions: SkillFunctions) {}

  public async updateBasicAttributesSkills(
    character: ICharacter,
    skills: ISkill,
    skillName: string,
    bonusOrPenalties: IBasicAttributesBonusAndPenalties
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
      case "strength": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillName,
          await this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.strength, skills[skillName].level)
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

      case "resistance": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillName,
          await this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.resistance, skills[skillName].level)
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

      case "dexterity": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillName,
          await this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.dexterity, skills[skillName].level)
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

      case "magic": {
        const bonusOrPenaltiesMagic = this.skillFunctions.calculateBonusOrPenaltiesMagicSP(
          bonusOrPenalties.magic,
          skills.magic.level
        );

        skillLevelUp = this.skillFunctions.updateSkillByType(skills, skillName, bonusOrPenaltiesMagic);

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillName].level,
          skillName: skillName,
          skillPoints: skills[skillName].skillPoints,
        };

        break;
      }

      case "magicResistance": {
        const bonusOrPenaltiesMagic = this.skillFunctions.calculateBonusOrPenaltiesMagicSP(
          bonusOrPenalties.magicResistance,
          skills.magicResistance.level
        );

        skillLevelUp = this.skillFunctions.updateSkillByType(skills, skillName, bonusOrPenaltiesMagic);

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

    const char = (await Character.findById(skills.owner)) as ICharacter;

    await this.skillFunctions.updateSkills(skills, char);

    return skillSpData;
  }
}
