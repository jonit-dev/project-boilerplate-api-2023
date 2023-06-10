import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterDeathCalculator } from "@providers/character/CharacterDeathCalculator";
import { BASIC_ATTRIBUTES, COMBAT_SKILLS, ISkillDetails, SKILLS_MAP, calculateSPToNextLevel } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { clearCacheForKey } from "speedgoose";
import { SkillCalculator } from "./SkillCalculator";
import { SkillFunctions } from "./SkillFunctions";

@provide(SkillDecrease)
export class SkillDecrease {
  constructor(
    private skillCalculator: SkillCalculator,
    private skillFunctions: SkillFunctions,
    private characterDeathCalculator: CharacterDeathCalculator
  ) {}

  public async deathPenalty(character: ICharacter): Promise<boolean> {
    try {
      await clearCacheForKey(`character-${character._id}-skills`);

      const decreaseXp = await this.decreaseCharacterXp(character);
      const decreaseBasicAttributes = await this.decreaseBasicAttributeSP(character);
      const decreaseCombatSkills = await this.decreaseCombatSkillsSP(character);
      // Crafting Skills penalty here ( not implemented yet )

      return decreaseXp ?? decreaseBasicAttributes ?? decreaseCombatSkills;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  private async decreaseCharacterXp(character: ICharacter): Promise<boolean> {
    const skills = (await Skill.findOne({ _id: character.skills }).lean()) as ISkill;
    if (!skills) {
      return false;
    }

    const xpLossOnDeath = this.characterDeathCalculator.calculateSkillLoss(skills);

    const currentXP = Math.round(skills.experience);
    const deathPenaltyXp = Math.round(currentXP * (xpLossOnDeath / 100));
    let newXpReduced = currentXP - deathPenaltyXp;
    newXpReduced = Math.max(newXpReduced, 0);

    skills.experience = newXpReduced;
    skills.xpToNextLevel = this.skillCalculator.calculateXPToNextLevel(newXpReduced, skills.level + 1);

    await this.skillFunctions.updateSkills(skills, character);
    return xpLossOnDeath > 0;
  }

  private async decreaseBasicAttributeSP(character: ICharacter): Promise<boolean> {
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;

    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }

    let hasDecreasedSP = false;

    try {
      for (let i = 0; i < BASIC_ATTRIBUTES.length; i++) {
        const decreasedSP = this.decreaseSP(skills, BASIC_ATTRIBUTES[i]);
        await this.skillFunctions.updateSkills(skills, character);

        if (decreasedSP) {
          hasDecreasedSP = true;
        }
      }

      return hasDecreasedSP;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  private async decreaseCombatSkillsSP(character: ICharacter): Promise<boolean> {
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;
    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }

    let hasDecreasedSP = false;
    try {
      for (let i = 0; i < COMBAT_SKILLS.length; i++) {
        const decreasedSP = this.decreaseSP(skills, COMBAT_SKILLS[i]);

        if (decreasedSP) {
          hasDecreasedSP = true;
        }

        await this.skillFunctions.updateSkills(skills, character);
      }

      return hasDecreasedSP;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  private decreaseSP(skills: ISkill, skillKey: string): boolean {
    const skillToUpdate = SKILLS_MAP.get(skillKey);

    if (!skillToUpdate) {
      throw new Error(`skill not found for item subtype ${skillKey}`);
    }

    const skill = skills[skillToUpdate] as ISkillDetails;

    const spLossOnDeath = this.characterDeathCalculator.calculateSkillLoss(skills);

    const skillPoints = Math.round(skill.skillPoints);
    const deathPenaltySP = Math.round(skillPoints * (spLossOnDeath / 100));
    let newSpReduced = skillPoints - deathPenaltySP;

    newSpReduced = Math.max(newSpReduced, 0);
    skill.skillPoints = newSpReduced;
    skill.level = Math.max(1, skill.level);
    skill.skillPointsToNextLevel = calculateSPToNextLevel(newSpReduced, skill.level + 1);

    skills[skillToUpdate] = skill;

    return spLossOnDeath > 0;
  }
}
