import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { SkillFunctions } from "@providers/skill/SkillFunctions";
import {
  IBasicAttributesBonusAndPenalties,
  ICombatSkillsBonusAndPenalties,
  IIncreaseSPResult,
  LifeBringerRaces,
  ShadowWalkerRaces,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterBasicAttributesBonusPenalties } from "./CharacterBasicAttributesBonusPenalties";
import { CharacterCombatBonusPenalties } from "./CharacterCombatBonusPenalties";

@provide(CharacterBonusPenalties)
export class CharacterBonusPenalties {
  constructor(
    private characterBasicAttributesBonusPenalties: CharacterBasicAttributesBonusPenalties,
    private characterCombatBonusPenalties: CharacterCombatBonusPenalties,
    // private characterCraftingBonusPenalties: CharacterCraftingBonusPenalties,
    private skillFunctions: SkillFunctions
  ) {}

  public async applyRaceBonusPenalties(character: ICharacter, skillType: string): Promise<void> {
    const skills = await Skill.findById(character.skills);

    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }

    let basicAttributes: IBasicAttributesBonusAndPenalties;
    let combatSkills: ICombatSkillsBonusAndPenalties;
    // let craftingGatheringSkills: ICraftingGatheringSkillsBonusAndPenalties;

    let skillSpData: IIncreaseSPResult = {
      skillLevelUp: false,
      skillLevelBefore: 0,
      skillLevelAfter: 0,
      skillName: "",
      skillPoints: 0,
    };

    switch (character.race) {
      case LifeBringerRaces.Dwarf: {
        // This is the % of each SP attribute that will be increased or decreased
        // We can use positive or negative values Ex: Use 20% = 0.2 and -10% = -0.1

        // Update Basic Attributes
        basicAttributes = {
          strength: 0.2,
          resistance: 0.2,
          dexterity: -0.1,
          magic: -0.1,
          magicResistance: 0.2,
        };

        if (skillType in basicAttributes) {
          skillSpData = await this.characterBasicAttributesBonusPenalties.updateBasicAttributesSkills(
            skills,
            skillType,
            basicAttributes
          );
        }

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

        if (skillType.toLocaleLowerCase() in combatSkills) {
          skillSpData = await this.characterCombatBonusPenalties.updateCombatSkills(skills, skillType, combatSkills);
        }

        // Update Crafting and Gathering Skills
        // craftingGatheringSkills = {};
        // this.updateCraftingGatheringSkills(craftingGatheringSkills);

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

        if (skillType in basicAttributes) {
          skillSpData = await this.characterBasicAttributesBonusPenalties.updateBasicAttributesSkills(
            skills,
            skillType,
            basicAttributes
          );
        }

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

        if (skillType.toLocaleLowerCase() in combatSkills) {
          skillSpData = await this.characterCombatBonusPenalties.updateCombatSkills(skills, skillType, combatSkills);
        }

        // Update Crafting and Gathering Skills
        // craftingGatheringSkills = {};
        // this.updateCraftingGatheringSkills(craftingGatheringSkills);
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

        if (skillType in basicAttributes) {
          skillSpData = await this.characterBasicAttributesBonusPenalties.updateBasicAttributesSkills(
            skills,
            skillType,
            basicAttributes
          );
        }

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

        if (skillType.toLocaleLowerCase() in combatSkills) {
          skillSpData = await this.characterCombatBonusPenalties.updateCombatSkills(skills, skillType, combatSkills);
        }

        // Update Crafting and Gathering Skills
        // craftingGatheringSkills = {};
        // this.updateCraftingGatheringSkills(craftingGatheringSkills);
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

        if (skillType in basicAttributes) {
          skillSpData = await this.characterBasicAttributesBonusPenalties.updateBasicAttributesSkills(
            skills,
            skillType,
            basicAttributes
          );
        }

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

        if (skillType.toLocaleLowerCase() in combatSkills) {
          skillSpData = await this.characterCombatBonusPenalties.updateCombatSkills(skills, skillType, combatSkills);
        }

        // Update Crafting and Gathering Skills
        // craftingGatheringSkills = {};
        // this.updateCraftingGatheringSkills(craftingGatheringSkills);
        break;
      }

      default: {
        break;
      }
    }

    if (skillSpData.skillLevelUp) {
      await this.skillFunctions.sendSkillLevelUpEvents(skillSpData, character);
    }
  }
}
