import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { SkillFunctions } from "@providers/skill/SkillFunctions";
import { IBasicAttributesBonusAndPenalties, IIncreaseSPResult } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterBasicAttributesBonusPenalties)
export class CharacterBasicAttributesBonusPenalties {
  constructor(private skillFunctions: SkillFunctions) {}

  public async updateBasicAttributesSkills(
    skills: ISkill,
    skillType: string,
    bonusOrPenalties: IBasicAttributesBonusAndPenalties
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
      case "strength": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.strength, skills[skillType].level)
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

      case "resistance": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.resistance, skills[skillType].level)
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

      case "dexterity": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.dexterity, skills[skillType].level)
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

      case "magic": {
        const bonusOrPenaltiesMagic = this.skillFunctions.calculateBonusOrPenaltiesMagicSP(
          bonusOrPenalties.magic,
          skills.magic.level
        );

        skillLevelUp = this.skillFunctions.updateSkillByType(skills, skillType, bonusOrPenaltiesMagic);

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevelBefore: skillSpData.skillLevelBefore,
          skillLevelAfter: skills[skillType].level,
          skillName: skillType,
          skillPoints: skills[skillType].skillPoints,
        };

        break;
      }

      case "magicResistance": {
        const bonusOrPenaltiesMagic = this.skillFunctions.calculateBonusOrPenaltiesMagicSP(
          bonusOrPenalties.magicResistance,
          skills.magicResistance.level
        );

        skillLevelUp = this.skillFunctions.updateSkillByType(skills, skillType, bonusOrPenaltiesMagic);

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
