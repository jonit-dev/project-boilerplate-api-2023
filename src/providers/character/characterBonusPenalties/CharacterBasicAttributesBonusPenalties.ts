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
        skillLevelUp = await this.skillFunctions.updateSkillByType(
          character,
          skills,
          skillName,
          await this.skillFunctions.calculateBonusOrPenaltiesSP(
            character,
            bonusOrPenalties.strength,
            skills[skillName].level,
            skillName
          )
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
        skillLevelUp = await this.skillFunctions.updateSkillByType(
          character,
          skills,
          skillName,
          await this.skillFunctions.calculateBonusOrPenaltiesSP(
            character,
            bonusOrPenalties.resistance,
            skills[skillName].level,
            skillName
          )
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
        skillLevelUp = await this.skillFunctions.updateSkillByType(
          character,
          skills,
          skillName,
          await this.skillFunctions.calculateBonusOrPenaltiesSP(
            character,
            bonusOrPenalties.dexterity,
            skills[skillName].level,
            skillName
          )
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
        const bonusOrPenaltiesMagic = await this.skillFunctions.calculateBonusOrPenaltiesMagicSP(
          character,
          bonusOrPenalties.magic,
          skills.magic.level,
          skillName
        );

        skillLevelUp = await this.skillFunctions.updateSkillByType(character, skills, skillName, bonusOrPenaltiesMagic);

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
        const bonusOrPenaltiesMagic = await this.skillFunctions.calculateBonusOrPenaltiesMagicSP(
          character,
          bonusOrPenalties.magicResistance,
          skills.magicResistance.level,
          skillName
        );

        skillLevelUp = await this.skillFunctions.updateSkillByType(character, skills, skillName, bonusOrPenaltiesMagic);

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
