import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { TrackClassExecutionTime } from "@jonit-dev/decorators-utils";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { SkillFunctions } from "@providers/skill/SkillFunctions";
import { CharacterClass, IIncreaseSPResult, LifeBringerRaces, SKILLS_MAP, ShadowWalkerRaces } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterBasicAttributesBonusPenalties } from "./CharacterBasicAttributesBonusPenalties";
import { CharacterClassBonusOrPenalties } from "./CharacterClassBonusOrPenalties";
import { CharacterCombatBonusPenalties } from "./CharacterCombatBonusPenalties";
import { CharacterCraftingBonusPenalties } from "./CharacterCraftingBonusPenalties";
import { CharacterRaceBonusOrPenalties } from "./CharacterRaceBonusOrPenalties";

@TrackClassExecutionTime()
@provide(CharacterBonusPenalties)
export class CharacterBonusPenalties {
  constructor(
    private characterBasicAttributesBonusPenalties: CharacterBasicAttributesBonusPenalties,
    private characterCombatBonusPenalties: CharacterCombatBonusPenalties,
    private characterCraftingBonusPenalties: CharacterCraftingBonusPenalties,
    private skillFunctions: SkillFunctions,
    private characterClassBonusOrPenalties: CharacterClassBonusOrPenalties,
    private characterRaceBonusOrPenalties: CharacterRaceBonusOrPenalties
  ) {}

  @TrackNewRelicTransaction()
  public async applyRaceBonusPenalties(character: ICharacter, skillType: string): Promise<void> {
    const skills = await this.getSkillsForCharacter(character);
    const skillToUpdate = SKILLS_MAP.get(skillType);

    if (!skillToUpdate) {
      throw new Error(`skill not found for item subtype ${skillType}`);
    }

    const classBonusOrPenalties = this.characterClassBonusOrPenalties.getClassBonusOrPenalties(
      character.class as CharacterClass
    );
    const raceBonusOrPenalties = this.characterRaceBonusOrPenalties.getRaceBonusOrPenaltises(
      character.race as LifeBringerRaces | ShadowWalkerRaces
    );

    const attributes = this.computeAttributes(raceBonusOrPenalties, classBonusOrPenalties);

    const updatePromises: Promise<IIncreaseSPResult>[] = [];

    for (const category in attributes) {
      if (skillToUpdate in attributes[category]) {
        updatePromises.push(this.updateSkillsBasedOnCategory(category, skills, skillToUpdate, attributes) as any);
      }
    }

    const skillSpDataResults = await Promise.all(updatePromises);

    // Check if any of the results had a skill level up
    const skillLevelUp = skillSpDataResults.some((result) => result.skillLevelUp);

    if (skillLevelUp) {
      // You can potentially send multiple events if there were multiple skills that leveled up.
      // Adjust as necessary based on your business logic.
      for (const skillSpData of skillSpDataResults) {
        if (skillSpData.skillLevelUp) {
          await this.skillFunctions.sendSkillLevelUpEvents(skillSpData, character);
        }
      }
    }
  }

  private async getSkillsForCharacter(character: ICharacter): Promise<ISkill> {
    const skills = (await Skill.findById(character.skills)
      .lean({
        virtuals: true,
        defaults: true,
      })
      .cacheQuery({
        cacheKey: `${character._id}-skills`,
      })) as ISkill;
    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }
    return skills;
  }

  private computeAttributes(raceBonusOrPenaltises, classBonusOrPenalties): any {
    const attributes = {
      basicAttributes: {},
      combatSkills: {},
      craftingSkills: {},
    };
    for (const category in attributes) {
      for (const skill in raceBonusOrPenaltises[category]) {
        attributes[category][skill] = raceBonusOrPenaltises[category][skill] + classBonusOrPenalties[category][skill];
      }
    }
    return attributes;
  }

  private async updateSkillsBasedOnCategory(
    category: string,
    skills,
    skillToUpdate,
    attributes
  ): Promise<IIncreaseSPResult | undefined> {
    switch (category) {
      case "basicAttributes":
        return await this.characterBasicAttributesBonusPenalties.updateBasicAttributesSkills(
          skills,
          skillToUpdate,
          attributes[category]
        );
      case "combatSkills":
        return await this.characterCombatBonusPenalties.updateCombatSkills(skills, skillToUpdate, attributes[category]);
      case "craftingSkills":
        return await this.characterCraftingBonusPenalties.updateCraftingSkills(
          skills,
          skillToUpdate,
          attributes[category]
        );
      default:
    }
  }
}
