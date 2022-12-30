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
      skillLevel: 0,
      skillName: "",
      skillPoints: 0,
    };

    switch (skillType) {
      case "strength": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.strength)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skillType].level,
          skillName: skillType,
          skillPoints: skills[skillType].skillPoints,
        };

        break;
      }

      case "resistance": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.resistance)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skillType].level,
          skillName: skillType,
          skillPoints: skills[skillType].skillPoints,
        };

        break;
      }

      case "dexterity": {
        skillLevelUp = this.skillFunctions.updateSkillByType(
          skills,
          skillType,
          this.skillFunctions.calculateBonusOrPenaltiesSP(bonusOrPenalties.dexterity)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skillType].level,
          skillName: skillType,
          skillPoints: skills[skillType].skillPoints,
        };

        break;
      }

      case "magic": {
        const bonusOrPenaltiesMagic = this.skillFunctions.calculateBonusOrPenaltiesMagicSP(bonusOrPenalties.magic);

        skillLevelUp = this.skillFunctions.updateSkillByType(skills, skillType, bonusOrPenaltiesMagic);

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skillType].level,
          skillName: skillType,
          skillPoints: skills[skillType].skillPoints,
        };

        break;
      }

      case "magicResistance": {
        const bonusOrPenaltiesMagic = this.skillFunctions.calculateBonusOrPenaltiesMagicSP(
          bonusOrPenalties.magicResistance
        );

        skillLevelUp = this.skillFunctions.updateSkillByType(skills, skillType, bonusOrPenaltiesMagic);

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skillType].level,
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
