import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { SP_INCREASE_RATIO } from "@providers/constants/SkillConstants";
import { SkillCalculator } from "@providers/skill/SkillCalculator";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  AnimationEffectKeys,
  IBasicAttributesBonusAndPenalties,
  ICombatSkillsBonusAndPenalties,
  ICraftingGatheringSkillsBonusAndPenalties,
  IIncreaseSPResult,
  ISkillDetails,
  IUIShowMessage,
  LifeBringerRaces,
  ShadowWalkerRaces,
  SkillEventType,
  SkillSocketEvents,
  SKILLS_MAP,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(CharacterBonusPenalties)
export class CharacterBonusPenalties {
  constructor(
    private socketMessaging: SocketMessaging,
    private skillCalculator: SkillCalculator,
    private animationEffect: AnimationEffect
  ) {}

  public async applyRaceBonusPenalties(character: ICharacter, skillType: string): Promise<void> {
    const skills = await Skill.findById(character.skills);

    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }

    let basicAttributes: IBasicAttributesBonusAndPenalties;
    let combatSkills: ICombatSkillsBonusAndPenalties;
    let craftingGatheringSkills: ICraftingGatheringSkillsBonusAndPenalties;

    switch (character.race) {
      case LifeBringerRaces.Dwarf: {
        // This is the % of each SP attribute that will be increased or decreased
        // We can use positive or negative values
        // Ex: Use 20% = 0.2 and -10% = -0.1
        // Update Basic Attributes
        basicAttributes = {
          strength: 0.2,
          resistance: 0.2,
          dexterity: -0.1,
          magic: -0.1,
          magicResistance: 0.2,
        };

        await this.updateBasicAttributesSkills(skills, skillType, basicAttributes);

        // Update Combat Skills
        combatSkills = {
          first: 0.1,
          sword: 0.1,
          dagger: 0.1,
          axe: 0.2,
          distance: -0.1,
          shielding: 0.1,
          club: 0.2,
        };

        await this.updateCombatSkills(skills, skillType, combatSkills);

        // Update Crafting and Gathering Skills
        craftingGatheringSkills = {};
        this.updateCraftingGatheringSkills(craftingGatheringSkills);

        break;
      }

      case LifeBringerRaces.Elf: {
        basicAttributes = {
          strength: -0.1,
          resistance: -0.1,
          dexterity: 0.1,
          magic: 0.1,
          magicResistance: 0.1,
        };

        await this.updateBasicAttributesSkills(skills, skillType, basicAttributes);

        // Update Combat Skills
        combatSkills = {
          first: 0.1,
          sword: 0.1,
          dagger: 0.1,
          axe: -0.1,
          distance: 0.2,
          shielding: 0.1,
          club: -0.1,
        };

        await this.updateCombatSkills(skills, skillType, combatSkills);

        // Update Crafting and Gathering Skills
        craftingGatheringSkills = {};
        this.updateCraftingGatheringSkills(craftingGatheringSkills);
        break;
      }

      case LifeBringerRaces.Human: {
        // Do Nothing
        break;
      }

      case ShadowWalkerRaces.Human: {
        // Do Nothing
        break;
      }

      case ShadowWalkerRaces.Minotaur: {
        basicAttributes = {
          strength: 0.3,
          resistance: 0.2,
          dexterity: -0.2,
          magic: -0.2,
          magicResistance: 0.2,
        };

        await this.updateBasicAttributesSkills(skills, skillType, basicAttributes);

        // Update Combat Skills
        combatSkills = {
          first: 0.1,
          sword: 0.1,
          dagger: 0.1,
          axe: 0.3,
          distance: -0.3,
          shielding: 0.1,
          club: 0.3,
        };

        await this.updateCombatSkills(skills, skillType, combatSkills);

        // Update Crafting and Gathering Skills
        craftingGatheringSkills = {};
        this.updateCraftingGatheringSkills(craftingGatheringSkills);
        break;
      }

      case ShadowWalkerRaces.Orc: {
        basicAttributes = {
          strength: 0.2,
          resistance: 0.1,
          dexterity: -0.1,
          magic: -0.2,
          magicResistance: 0.2,
        };

        await this.updateBasicAttributesSkills(skills, skillType, basicAttributes);

        // Update Combat Skills
        combatSkills = {
          first: 0.1,
          sword: 0.1,
          dagger: 0.1,
          axe: 0.2,
          distance: -0.2,
          shielding: 0.1,
          club: 0.2,
        };

        await this.updateCombatSkills(skills, skillType, combatSkills);

        // Update Crafting and Gathering Skills
        craftingGatheringSkills = {};
        this.updateCraftingGatheringSkills(craftingGatheringSkills);
        break;
      }

      default: {
        break;
      }
    }
  }

  private async updateBasicAttributesSkills(
    skills: ISkill,
    skillType: string,
    bonusOrPenalties: IBasicAttributesBonusAndPenalties
  ): Promise<void> {
    let skillLevelUp: boolean = false;
    let skillSpData: IIncreaseSPResult;
    const character = (await Character.findById(skills.owner)) as ICharacter;

    switch (skillType) {
      case "strength": {
        skillLevelUp = this.updateSkillByType(
          skills,
          skillType,
          this.calculateBonusOrPenaltiesSP(bonusOrPenalties.strength)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skillType].level,
          skillName: skillType,
        };

        if (skillLevelUp) {
          await this.sendSkillLevelUpEvents(character, skillSpData);
        }

        break;
      }

      case "resistance": {
        skillLevelUp = this.updateSkillByType(
          skills,
          skillType,
          this.calculateBonusOrPenaltiesSP(bonusOrPenalties.resistance)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skillType].level,
          skillName: skillType,
        };

        if (skillLevelUp) {
          await this.sendSkillLevelUpEvents(character, skillSpData);
        }

        break;
      }

      case "dexterity": {
        skillLevelUp = this.updateSkillByType(
          skills,
          skillType,
          this.calculateBonusOrPenaltiesSP(bonusOrPenalties.dexterity)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skillType].level,
          skillName: skillType,
        };

        if (skillLevelUp) {
          await this.sendSkillLevelUpEvents(character, skillSpData);
        }
        break;
      }

      case "magic": {
        const bonusOrPenaltiesMagic = this.calculateBonusOrPenaltiesMagicSP(bonusOrPenalties.magic);

        skillLevelUp = this.updateSkillByType(skills, skillType, bonusOrPenaltiesMagic);

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skillType].level,
          skillName: skillType,
        };

        if (skillLevelUp) {
          await this.sendSkillLevelUpEvents(character, skillSpData);
        }

        break;
      }

      case "magicResistance": {
        const bonusOrPenaltiesMagic = this.calculateBonusOrPenaltiesMagicSP(bonusOrPenalties.magicResistance);

        skillLevelUp = this.updateSkillByType(skills, skillType, bonusOrPenaltiesMagic);

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skillType].level,
          skillName: skillType,
        };

        if (skillLevelUp) {
          await this.sendSkillLevelUpEvents(character, skillSpData);
        }

        break;
      }

      default:
        break;
    }

    await this.updateSkills(skills, character);
  }

  private async updateCombatSkills(
    skills: ISkill,
    skillType: string,
    bonusOrPenalties: ICombatSkillsBonusAndPenalties
  ): Promise<void> {
    let skillLevelUp: boolean = false;
    let skillSpData: IIncreaseSPResult;
    const character = (await Character.findById(skills.owner)) as ICharacter;
    const skyllTypeLowerCase = skillType.toLowerCase();

    switch (skyllTypeLowerCase) {
      case "none": {
        const firstType = "first";
        skillLevelUp = this.updateSkillByType(
          skills,
          skillType,
          this.calculateBonusOrPenaltiesSP(bonusOrPenalties.first)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[firstType].level,
          skillName: skillType,
        };

        if (skillLevelUp) {
          await this.sendSkillLevelUpEvents(character, skillSpData);
        }

        break;
      }

      case "sword": {
        skillLevelUp = this.updateSkillByType(
          skills,
          skillType,
          this.calculateBonusOrPenaltiesSP(bonusOrPenalties.sword)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skyllTypeLowerCase].level,
          skillName: skillType,
        };

        if (skillLevelUp) {
          await this.sendSkillLevelUpEvents(character, skillSpData);
        }

        break;
      }

      case "dagger": {
        skillLevelUp = this.updateSkillByType(
          skills,
          skillType,
          this.calculateBonusOrPenaltiesSP(bonusOrPenalties.dagger)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skyllTypeLowerCase].level,
          skillName: skillType,
        };

        if (skillLevelUp) {
          await this.sendSkillLevelUpEvents(character, skillSpData);
        }
        break;
      }

      case "axe": {
        skillLevelUp = this.updateSkillByType(
          skills,
          skillType,
          this.calculateBonusOrPenaltiesSP(bonusOrPenalties.axe)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[skyllTypeLowerCase].level,
          skillName: skillType,
        };

        if (skillLevelUp) {
          await this.sendSkillLevelUpEvents(character, skillSpData);
        }

        break;
      }

      case "ranged": {
        const rangedType = "distance";
        skillLevelUp = this.updateSkillByType(
          skills,
          skillType,
          this.calculateBonusOrPenaltiesSP(bonusOrPenalties.distance)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[rangedType].level,
          skillName: skillType,
        };

        if (skillLevelUp) {
          await this.sendSkillLevelUpEvents(character, skillSpData);
        }

        break;
      }

      case "spear": {
        const rangedType = "distance";
        skillLevelUp = this.updateSkillByType(
          skills,
          skillType,
          this.calculateBonusOrPenaltiesSP(bonusOrPenalties.distance)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[rangedType].level,
          skillName: skillType,
        };

        if (skillLevelUp) {
          await this.sendSkillLevelUpEvents(character, skillSpData);
        }

        break;
      }

      case "shield": {
        const shieldType = "shielding";
        skillLevelUp = this.updateSkillByType(
          skills,
          skillType,
          this.calculateBonusOrPenaltiesSP(bonusOrPenalties.shielding)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[shieldType].level,
          skillName: skillType,
        };

        if (skillLevelUp) {
          await this.sendSkillLevelUpEvents(character, skillSpData);
        }

        break;
      }

      case "mace": {
        const maceType = "club";
        skillLevelUp = this.updateSkillByType(
          skills,
          skillType,
          this.calculateBonusOrPenaltiesSP(bonusOrPenalties.club)
        );

        skillSpData = {
          skillLevelUp: skillLevelUp,
          skillLevel: skills[maceType].level,
          skillName: skillType,
        };

        if (skillLevelUp) {
          await this.sendSkillLevelUpEvents(character, skillSpData);
        }

        break;
      }

      default:
        break;
    }

    await this.updateSkills(skills, character);
  }

  private updateCraftingGatheringSkills(craftingGatheringSkills): void {
    // Todo: Update crafting and Gathering skills
  }

  private updateSkillByType(skills: ISkill, skillType: string, bonusOrPenalties: number): boolean {
    let skillLevelUp = false;
    const skillToUpdate = SKILLS_MAP.get(skillType);

    if (!skillToUpdate) {
      throw new Error(`skill not found for item subtype ${skillType}`);
    }

    const skill = skills[skillToUpdate] as ISkillDetails;

    if (bonusOrPenalties > 0) skill.skillPoints += bonusOrPenalties;
    if (bonusOrPenalties < 0) skill.skillPoints -= bonusOrPenalties * -1;

    skill.skillPointsToNextLevel = this.skillCalculator.calculateSPToNextLevel(skill.skillPoints, skill.level + 1);

    if (skill.skillPointsToNextLevel <= 0) {
      skillLevelUp = true;
      skill.level++;
      skill.skillPointsToNextLevel = this.skillCalculator.calculateSPToNextLevel(skill.skillPoints, skill.level + 1);
    }

    return skillLevelUp;
  }

  private async sendSkillLevelUpEvents(character: ICharacter, skillSpData: IIncreaseSPResult): Promise<void> {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: `You advanced from level ${skillSpData.skillLevel - 1} to ${skillSpData.skillLevel} in ${_.startCase(
        _.toLower(skillSpData.skillName)
      )} fighting.`,
      type: "info",
    });

    const levelUpEventPayload = {
      characterId: character.id,
      eventType: SkillEventType.SkillLevelUp,
      level: skillSpData.skillLevel,
      skill: skillSpData.skillName,
    };

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.SkillGain, levelUpEventPayload);

    await this.animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.SkillLevelUp);
  }

  private calculateBonusOrPenaltiesMagicSP(magicBonusOrPenalties: number): number {
    return (magicBonusOrPenalties / 10) * 3;
  }

  private calculateBonusOrPenaltiesSP(bonusOrPenalties: number): number {
    return SP_INCREASE_RATIO * bonusOrPenalties;
  }

  private async updateSkills(skills: ISkill, character: ICharacter): Promise<void> {
    await skills.save();

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.ReadInfo, {
      skill: skills,
    });
  }
}
